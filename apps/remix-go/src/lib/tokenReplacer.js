export function replaceTokens(text, tokenValues = {}) {
  if (!text || typeof text !== 'string') return text;

  return text
    .replace(/\{\{up\s+(\w+)\}\}/g, (_, token) =>
      (tokenValues[token] || '').toUpperCase())
    .replace(/\{\{d\s+(\w+)\s+"([^"]*)"\}\}/g, (_, token, defaultVal) =>
      tokenValues[token] || defaultVal)
    .replace(/\{\{(\w+)\}\}/g, (_, token) =>
      tokenValues[token] || '');
}

export function getTokenValuesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const values = {};
  for (const [key, value] of params.entries()) {
    values[key] = value;
  }
  return values;
}

export function buildPersonalizedURL(baseURL, tokenValues = {}) {
  const url = new URL(baseURL);
  Object.entries(tokenValues).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}

export const EMAIL_PROVIDER_TOKENS = {
  mailchimp: (token) => `*|${token.toUpperCase()}|*`,
  aweber: (token) => `{!${token.toLowerCase()}}`,
  interspire: (token) => `%%${token.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}%%`,
  getresponse: (token) => `[[${token.toLowerCase()}]]`,
  infusionsoft: (token) => `~Contact.${token.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}~`,
  sendlane: (token) => `VAR_${token.toUpperCase()}`,
  constantcontact: (token) => `{!$Subscriber.${token.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}}`,
  sendreach: (token) => `[${token.toUpperCase()}]`,
  custom: (token) => `${token.toLowerCase()}_token`,
};

export function buildProviderURL(baseURL, tokens, provider) {
  const formatter = EMAIL_PROVIDER_TOKENS[provider] || EMAIL_PROVIDER_TOKENS.custom;
  const tokenValues = {};
  tokens.forEach(token => {
    tokenValues[token] = formatter(token);
  });
  return buildPersonalizedURL(baseURL, tokenValues);
}

export default {
  replaceTokens,
  getTokenValuesFromURL,
  buildPersonalizedURL,
  buildProviderURL,
  EMAIL_PROVIDER_TOKENS,
};
