export const VIDEO_MODELS = [
  { id: 'kling-v3', name: 'Kling v3.0', provider: 'Kuaishou', type: 'text-to-video', maxDuration: 10, speed: 'fast', quality: 'high', costPerSec: 0.05 },
  { id: 'kling-v2', name: 'Kling v2.0', provider: 'Kuaishou', type: 'text-to-video', maxDuration: 10, speed: 'medium', quality: 'high', costPerSec: 0.04 },
  { id: 'kling-v1.6', name: 'Kling v1.6', provider: 'Kuaishou', type: 'text-to-video', maxDuration: 10, speed: 'fast', quality: 'medium', costPerSec: 0.03 },
  { id: 'sora', name: 'Sora', provider: 'OpenAI', type: 'text-to-video', maxDuration: 20, speed: 'slow', quality: 'very-high', costPerSec: 0.10 },
  { id: 'veo-3', name: 'Veo 3', provider: 'Google', type: 'text-to-video', maxDuration: 8, speed: 'medium', quality: 'very-high', costPerSec: 0.08 },
  { id: 'wan-2.2', name: 'Wan 2.2', provider: 'Alibaba', type: 'text-to-video', maxDuration: 15, speed: 'fast', quality: 'high', costPerSec: 0.04 },
  { id: 'wan-2.1', name: 'Wan 2.1', provider: 'Alibaba', type: 'text-to-video', maxDuration: 10, speed: 'fast', quality: 'medium', costPerSec: 0.03 },
  { id: 'seedance', name: 'Seedance', provider: 'ByteDance', type: 'text-to-video', maxDuration: 10, speed: 'fast', quality: 'medium', costPerSec: 0.03 },
  { id: 'minimax-hailuo', name: 'MiniMax Hailuo', provider: 'MiniMax', type: 'text-to-video', maxDuration: 6, speed: 'fast', quality: 'high', costPerSec: 0.05 },
];

export const I2V_MODELS = [
  { id: 'kling-v2', name: 'Kling v2.0 I2V', provider: 'Kuaishou', type: 'image-to-video', maxDuration: 10 },
  { id: 'kling-v1.6', name: 'Kling v1.6 I2V', provider: 'Kuaishou', type: 'image-to-video', maxDuration: 5 },
  { id: 'wan-2.2', name: 'Wan 2.2 I2V', provider: 'Alibaba', type: 'image-to-video', maxDuration: 10 },
  { id: 'seedance', name: 'Seedance I2V', provider: 'ByteDance', type: 'image-to-video', maxDuration: 5 },
];

export const IMAGE_MODELS = [
  { id: 'flux-schnell', name: 'Flux Schnell', provider: 'Black Forest Labs', type: 'text-to-image', speed: 'very-fast', quality: 'medium' },
  { id: 'flux-dev', name: 'Flux Dev', provider: 'Black Forest Labs', type: 'text-to-image', speed: 'medium', quality: 'high' },
  { id: 'flux-pro', name: 'Flux Pro', provider: 'Black Forest Labs', type: 'text-to-image', speed: 'slow', quality: 'very-high' },
  { id: 'flux-kontext-pro-i2i', name: 'Flux Kontext Pro', provider: 'Black Forest Labs', type: 'image-to-image', speed: 'medium', quality: 'high' },
  { id: 'flux-pulid', name: 'Flux PuLID', provider: 'Black Forest Labs', type: 'face-preserving', speed: 'medium', quality: 'high' },
  { id: 'sdxl', name: 'SDXL', provider: 'Stability AI', type: 'text-to-image', speed: 'medium', quality: 'high' },
];

export const AUDIO_MODELS = [
  { id: 'minimax-voice-clone', name: 'MiniMax Voice Clone', provider: 'MiniMax', type: 'voice-clone', minSampleSec: 30 },
  { id: 'minimax-speech-2.6-hd', name: 'MiniMax Speech 2.6 HD', provider: 'MiniMax', type: 'text-to-speech' },
  { id: 'elevenlabs', name: 'ElevenLabs', provider: 'ElevenLabs', type: 'text-to-speech' },
];

export const AVATAR_MODELS = [
  { id: 'kling-v2-avatar-pro', name: 'Kling Avatar Pro', provider: 'Kuaishou', type: 'photo-audio-to-video', maxDuration: 15 },
  { id: 'wan2.2-speech-to-video', name: 'Wan 2.2 Speech→Video', provider: 'Alibaba', type: 'speech-to-video', maxDuration: 10 },
  { id: 'infinitetalk-image-to-video', name: 'InfiniteTalk', provider: 'InfiniteTalk', type: 'talking-photo', maxDuration: 30 },
];

export const LIPSYNC_MODELS = [
  { id: 'ltx-2.3-lipsync', name: 'LTX Lip Sync', provider: 'Lightricks', type: 'lip-sync', speed: 'fast' },
  { id: 'latent-sync', name: 'Latent Sync', provider: 'OpenSource', type: 'lip-sync', speed: 'medium' },
  { id: 'creatify-lipsync', name: 'Creatify Lip Sync', provider: 'Creatify', type: 'lip-sync', speed: 'fast' },
  { id: 'veed-lipsync', name: 'VEED Lip Sync', provider: 'VEED', type: 'lip-sync', speed: 'fast' },
];

export const TEXT_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', type: 'text-generation' },
  { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', provider: 'Anthropic', type: 'text-generation' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', type: 'text-generation' },
];

export const ALL_MODELS = {
  video: VIDEO_MODELS,
  i2v: I2V_MODELS,
  image: IMAGE_MODELS,
  audio: AUDIO_MODELS,
  avatar: AVATAR_MODELS,
  lipsync: LIPSYNC_MODELS,
  text: TEXT_MODELS,
};

export function getModel(id) {
  for (const models of Object.values(ALL_MODELS)) {
    const found = models.find(m => m.id === id);
    if (found) return found;
  }
  return null;
}

export function getModelsByType(type) {
  return ALL_MODELS[type] || [];
}

export default ALL_MODELS;
