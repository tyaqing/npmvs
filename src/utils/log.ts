import axios from "axios";
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
  await axios.get(`${process.env.VUE_APP_ABFREE_API}/log?${query}`);
}

// pv上报
export async function reportPv(json: IReportType) {
  await logReport({
    subject: "pv",
    ...json,
  });
}
