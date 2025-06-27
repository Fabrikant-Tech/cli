const protocolCheck = new RegExp(/^(%20|\s)*(javascript|data|vbscript)/im);
const characterCheck = new RegExp(/[^\x20-\x7EÀ-ž]/gim);
const urlCheck = new RegExp(/^([^:]+):/gm);
const disallowedFirstCharacter = ['.', '/'];

const checkCharacters = (url: string) => {
  return disallowedFirstCharacter.indexOf(url[0]) > -1;
};

export const getSanitizedURL = (url: string) => {
  const safeDefault = 'about:blank';

  if (url === undefined) {
    return safeDefault;
  }
  checkCharacters(url);

  const cleanURL = url.replace(characterCheck, '').trim();
  checkCharacters(cleanURL);

  const urlChecked = cleanURL.match(urlCheck);
  if (!urlChecked) {
    return cleanURL;
  }

  const urlProtocol = cleanURL[0];
  if (protocolCheck.test(urlProtocol)) {
    return safeDefault;
  }

  return cleanURL;
};
