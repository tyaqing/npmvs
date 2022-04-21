export const proxyWrap = (url: string) => {
  return `https://api.abfree.com/proxy?url=${encodeURIComponent(url)}`;
};
