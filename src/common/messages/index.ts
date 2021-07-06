
export function getMessages(module: string, lang: string) {
  const messages = require(`./${module}/${lang}.json`) || {};
  return {
    ...messages,
  };
}