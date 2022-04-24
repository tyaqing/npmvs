import axios from "axios";
import { setupCache } from "axios-cache-adapter";

export const proxyWrap = (url: string) => {
  return `${process.env.VUE_APP_ABFREE_API}/proxy?url=${encodeURIComponent(
    url
  )}`;
};

// Create `axios-cache-adapter` instance
export const cache = setupCache({
  maxAge: 15 * 60 * 1000, // 15分钟
  exclude: {
    query: false,
  },
});

// Create `axios` instance passing the newly created `cache.adapter`
export const request = axios.create({
  adapter: cache.adapter,
});
