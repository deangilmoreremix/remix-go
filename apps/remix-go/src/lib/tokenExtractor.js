const TOKEN_REGEX = /\{\{(up\s+)?(d\s+)?(\w+)(?:\s+"([^"]*)")?\}\}/g;

export function extractTokens(projectData) {
  const tokens = new Set();
  const scanObject = (obj) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      let match;
      const regex = /\{\{[^}]+\}\}/g;
      while ((match = regex.exec(obj)) !== null) {
        const tokenMatch = match[0].match(/\{\{(?:up\s+)?(?:d\s+)?(\w+)/);
        if (tokenMatch && tokenMatch[1]) {
          tokens.add(tokenMatch[1]);
        }
      }
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(scanObject);
    }
  };
  scanObject(projectData);
  return [...tokens];
}

export function extractTokenDetails(projectData) {
  const tokens = [];
  const scanObject = (obj) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      const regex = /\{\{((?:up\s+)?(?:d\s+)?)?(\w+)(?:\s+"([^"]*)")?\}\}/g;
      let match;
      while ((match = regex.exec(obj)) !== null) {
        const prefix = (match[1] || '').trim();
        const token = match[2];
        const defaultValue = match[3] || '';
        let mode = 'plain';
        if (prefix.startsWith('up')) mode = 'uppercase';
        else if (prefix.startsWith('d')) mode = 'fallback';
        tokens.push({ token, mode, defaultValue, raw: match[0] });
      }
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(scanObject);
    }
  };
  scanObject(projectData);
  return tokens;
}

export function getAvailableTokens() {
  return [
    { key: 'FIRSTNAME', label: 'First Name', example: 'John' },
    { key: 'LASTNAME', label: 'Last Name', example: 'Smith' },
    { key: 'NAME', label: 'Full Name', example: 'John Smith' },
    { key: 'EMAIL', label: 'Email', example: 'john@example.com' },
    { key: 'GENDER', label: 'Gender', example: 'Male' },
    { key: 'GEOCOUNTRY', label: 'Country', example: 'United States' },
    { key: 'GEOCITY', label: 'City', example: 'New York' },
    { key: 'GEOSTATE', label: 'State', example: 'California' },
    { key: 'COMPANY', label: 'Company', example: 'Acme Inc' },
    { key: 'CUSTOM', label: 'Custom Token', example: '' },
  ];
}

export function formatToken(token, mode = 'plain', defaultValue = '') {
  if (mode === 'uppercase') return `{{up ${token}}}`;
  if (mode === 'fallback') return `{{d ${token} "${defaultValue}"}}`;
  return `{{${token}}}`;
}

export default {
  extractTokens,
  extractTokenDetails,
  getAvailableTokens,
  formatToken,
};
