import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client
// NOTE: In a real production app, handle API keys more securely.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
你是一位专业的、富有同情心的心血管健康助手，专门协助一位刚做完心脏支架手术且有全身血管堵塞情况的老年患者。

你的职责：
1. 提供关于心脏康复的建议（低盐低油饮食、温和运动、规律作息）。
2. 解释药物依从性的重要性（但不要给出具体的医疗处方调整建议）。
3. 安抚患者情绪，鼓励健康的生活方式。
4. 语言风格：温暖、清晰、尊老、简单易懂。字体排版要清晰。

重要安全原则：
- 如果用户提到胸痛、呼吸急促、晕厥等严重症状，必须立即建议就医或拨打急救电话。
- 不要代替医生进行诊断。
- 针对"心脏支架"和"血管堵塞"，强调防栓、降脂的重要性。
`;

export const generateHealthAdvice = async (userPrompt: string, contextData?: string): Promise<string> => {
  try {
    const modelId = 'gemini-3-flash-preview';
    
    let fullPrompt = userPrompt;
    if (contextData) {
      fullPrompt = `当前患者状态数据: ${contextData}\n\n用户问题: ${userPrompt}`;
    }

    const response = await ai.models.generateContent({
      model: modelId,
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balanced for helpful but safe advice
      },
    });

    return response.text || "抱歉，我现在无法连接到健康助手，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "网络连接出现问题，请检查网络或稍后再试。";
  }
};

// --- Audio Decoding Helpers for TTS ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const playTextAsSpeech = async (text: string): Promise<void> => {
  try {
    // Initialize AudioContext
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // 'Kore' is often good for neutral/warm tones
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      console.warn("TTS: No audio data received.");
      return;
    }

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);
    source.start();

  } catch (error) {
    console.error("TTS Error:", error);
    throw error; // Re-throw to let UI know it failed
  }
};