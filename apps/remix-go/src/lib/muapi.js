const API_BASE = 'https://api.muapi.ai/v1';

class RequestQueue {
  constructor(maxConcurrent = 5, intervalMs = 1000) {
    this.maxConcurrent = maxConcurrent;
    this.intervalMs = intervalMs;
    this.queue = [];
    this.running = 0;
    this.timestamps = [];
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) return;

    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < 60000);
    if (this.timestamps.length >= 30) {
      setTimeout(() => this.process(), this.intervalMs);
      return;
    }

    const { fn, resolve, reject } = this.queue.shift();
    this.running++;
    this.timestamps.push(now);

    try {
      const result = await fn();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.running--;
      this.process();
    }
  }
}

class MuapiClient {
  constructor({ apiKey, baseUrl, maxConcurrent = 3 } = {}) {
    this.apiKey = apiKey || '';
    this.baseUrl = baseUrl || API_BASE;
    this.queue = new RequestQueue(maxConcurrent);
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  async _request(method, path, body = null, options = {}) {
    return this.queue.add(async () => {
      const url = `${this.baseUrl}${path}`;
      const headers = {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}),
        ...(options.headers || {}),
      };

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), options.timeout || 120000);

      try {
        const resp = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!resp.ok) {
          const errorData = await resp.json().catch(() => ({}));
          const err = new Error(errorData.message || `API error ${resp.status}`);
          err.status = resp.status;
          err.data = errorData;
          throw err;
        }

        return await resp.json();
      } catch (err) {
        clearTimeout(timeout);
        if (err.name === 'AbortError') {
          throw new Error('Request timed out');
        }
        throw err;
      }
    });
  }

  _poll(taskId, intervalMs = 3000, maxAttempts = 200) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const poll = async () => {
        attempts++;
        try {
          const result = await this._request('GET', `/tasks/${taskId}`);
          if (result.status === 'completed' || result.status === 'succeeded') {
            resolve(result);
          } else if (result.status === 'failed' || result.status === 'error') {
            reject(new Error(result.error || 'Task failed'));
          } else if (attempts >= maxAttempts) {
            reject(new Error('Polling timeout exceeded'));
          } else {
            setTimeout(poll, intervalMs);
          }
        } catch (err) {
          if (attempts >= maxAttempts) reject(err);
          else setTimeout(poll, intervalMs);
        }
      };
      poll();
    });
  }

  async generateVideo({ prompt, model = 'kling-v3', duration = 5, aspect_ratio = '16:9', negative_prompt = '', callback_url = null }) {
    const body = { prompt, model, duration, aspect_ratio };
    if (negative_prompt) body.negative_prompt = negative_prompt;
    if (callback_url) body.callback_url = callback_url;

    const result = await this._request('POST', '/video/generate', body);
    if (result.task_id) return this._poll(result.task_id);
    return result;
  }

  async generateI2V({ image_url, prompt, model = 'kling-v2', duration = 5, aspect_ratio = '16:9' }) {
    const body = { image_url, prompt, model, duration, aspect_ratio };
    const result = await this._request('POST', '/video/i2v', body);
    if (result.task_id) return this._poll(result.task_id);
    return result;
  }

  async generateImage({ prompt, model = 'flux-schnell', aspect_ratio = '16:9', negative_prompt = '', num_images = 1 }) {
    const body = { prompt, model, aspect_ratio, num_images };
    if (negative_prompt) body.negative_prompt = negative_prompt;
    return this._request('POST', '/image/generate', body);
  }

  async generateI2I({ image_url, prompt, model = 'flux-kontext-pro-i2i', strength = 0.75 }) {
    return this._request('POST', '/image/i2i', { image_url, prompt, model, strength });
  }

  async generateAvatar({ photo_url, audio_url, model = 'kling-v2-avatar-pro', duration = 10 }) {
    const body = { photo_url, audio_url, model, duration };
    const result = await this._request('POST', '/avatar/generate', body);
    if (result.task_id) return this._poll(result.task_id);
    return result;
  }

  async generateAudio({ text, model = 'minimax-speech-2.6-hd', voice_sample_url = null, speed = 1.0 }) {
    const body = { text, model, speed };
    if (voice_sample_url) body.voice_sample_url = voice_sample_url;
    return this._request('POST', '/audio/generate', body);
  }

  async cloneVoice({ sample_url, text, model = 'minimax-voice-clone', speed = 1.0 }) {
    return this._request('POST', '/audio/clone', { sample_url, text, model, speed });
  }

  async lipSync({ video_url, audio_url, model = 'ltx-2.3-lipsync' }) {
    const body = { video_url, audio_url, model };
    const result = await this._request('POST', '/video/lipsync', body);
    if (result.task_id) return this._poll(result.task_id);
    return result;
  }

  async generateText({ prompt, model = 'gpt-4o', system_prompt = '', max_tokens = 500 }) {
    return this._request('POST', '/text/generate', { prompt, model, system_prompt, max_tokens });
  }

  async processVideoTool({ video_url, tool, params = {} }) {
    const body = { video_url, tool, ...params };
    const result = await this._request('POST', '/video/tool', body);
    if (result.task_id) return this._poll(result.task_id);
    return result;
  }

  async removeBackground({ image_url, model = 'ai-background-remover' }) {
    return this._request('POST', '/image/remove-background', { image_url, model });
  }

  async getTaskStatus(taskId) {
    return this._request('GET', `/tasks/${taskId}`);
  }
}

let defaultInstance = null;

export function getClient(options) {
  if (!defaultInstance) {
    defaultInstance = new MuapiClient(options);
  } else if (options?.apiKey) {
    defaultInstance.setApiKey(options.apiKey);
  }
  return defaultInstance;
}

export function createClient(options) {
  return new MuapiClient(options);
}

export default MuapiClient;
