const BASE = 'https://pageshot.site/v1';

export async function captureScreenshot(url, options = {}) {
  const response = await fetch(`${BASE}/screenshot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      width: options.width || 1920,
      height: options.height || 1080,
      format: 'png',
      full_page: false,
      block_ads: true,
      hide_banners: true,
      delay: 2000,
      response: 'json',
      ...options,
    }),
  });
  const data = await response.json();
  return data.data.image;
}

export async function captureBatch(urls, options = {}) {
  const response = await fetch(`${BASE}/screenshot/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls, ...options }),
  });
  return (await response.json()).results;
}

export async function captureLinkedIn(profileUrl) {
  return captureScreenshot(profileUrl, {
    width: 1200,
    height: 627,
    hide_banners: true,
    block_ads: true,
    evaluate: `
      document.querySelector('nav')?.style.setProperty('display', 'none');
      document.querySelector('.scaffold-layout__aside')?.style.setProperty('display', 'none');
      document.querySelector('footer')?.style.setProperty('display', 'none');
    `,
  });
}
