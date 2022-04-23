// 千分位转换
export const thousand = (v: string) =>
  `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`);
