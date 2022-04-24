export const proxyWrap = (url: string) => {
  return `${process.env.VUE_APP_ABFREE_API}/proxy?url=${encodeURIComponent(
    url
  )}`;
};
