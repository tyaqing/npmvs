import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "windi.css";
import "@/assets/global.less";
import { Button } from "ant-design-vue";
import { reportPv } from "@/utils/log";

router.afterEach(({ path }) => {
  reportPv({
    ext1: path,
  }).then();
});
createApp(App).use(Button).use(router).mount("#app");
