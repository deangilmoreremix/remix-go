const REGEX_MAP = {
  YouTube: /^(?:https?:\/\/www\.|https?:\/\/m\.|https?:\/\/|www\.|\.|^)youtu/,
  Vimeo: /^(?:https?:\/\/www\.|https?:\/\/|www\.|\.|^)(vimeo\.com(\/[A-z0-9]*)+|player\.vimeo\.com\/video\/\d+)/,
  SoundCloud: /^(?:https?:\/\/www\.|https?:\/\/|www\.|\.|^)(w\.)?(soundcloud)/,
  Image: /((https|http)?:\/\/.*\.(?:png|jpg|jpeg|bmp|svg|gif|webp))/,
  Video: /((https|http)?:\/\/.*\.(?:mp4|webm|ogg|mov))/,
  Audio: /((https|http)?:\/\/.*\.(?:mp3|wav|ogg|flac|aac))/,
};

export function detectMediaType(url) {
  for (const [type, regex] of Object.entries(REGEX_MAP)) {
    if (regex.test(url)) return type;
  }
  return 'HTML5';
}

export function getYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getVimeoId(url) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
}

export function extractYouTubeDuration(duration) {
  let parts = duration.match(/\d+/g);
  if (!parts) return 15;
  parts = parts.map(Number);

  if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1 && duration.indexOf('S') === -1) {
    parts = [parts[0], 0, 0];
  } else if (duration.indexOf('H') >= 0 && duration.indexOf('M') === -1) {
    parts = [parts[0], 0, parts[1]];
  } else if (duration.indexOf('M') >= 0 && duration.indexOf('H') === -1 && duration.indexOf('S') === -1) {
    parts = [0, parts[0], 0];
  }

  let secs = 0;
  if (parts.length === 3) secs = parts[0] * 3600 + parts[1] * 60 + parts[2];
  else if (parts.length === 2) secs = parts[0] * 60 + parts[1];
  else secs = parts[0];

  return secs || 15;
}

export async function getMediaDuration(url) {
  const type = detectMediaType(url);
  if (type === 'Image') return 5;

  return new Promise((resolve, reject) => {
    const elem = type === 'Audio' ? document.createElement('audio') : document.createElement('video');
    elem.addEventListener('loadedmetadata', () => resolve(elem.duration));
    elem.addEventListener('error', () => reject(new Error('Failed to load media')));
    elem.src = url;
  });
}

export default {
  detectMediaType,
  getYouTubeId,
  getVimeoId,
  extractYouTubeDuration,
  getMediaDuration,
};
