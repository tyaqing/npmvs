import qs from "qs";

interface IReportType {
  url?: string;
  subject?: string;
  ext1?: string;
  ext2?: string;
  ext3?: string;
  ext4?: string;
}
export async function logReport(json: IReportType) {
  const query = qs.stringify({
    url: `${location.pathname}${location.search}${location.hash}`,
    ext1: "",
    ext2: "",
    ext3: "",
    ext4: "",
    ...json,
    ua: navigator.userAgent,
    referer: document.referrer,
    project: "npmvs",
    env: process.env.NODE_ENV,
    client_time: Date.now(),
    version: "prod",
  });
  imgReport(`${process.env.VUE_APP_LOG_API}/log?${query}`);
}

export function imgReport(url: string) {
  if (!url) return;
  new Image().src = url;
}

// pv上报
export async function reportPv(json: IReportType) {
  await logReport({
    subject: "pv",
    ...json,
  });
}
