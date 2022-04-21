import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "windi.css";
import "@/assets/global.less";
import { Button } from "ant-design-vue";

createApp(App).use(Button).use(router).mount("#app");
