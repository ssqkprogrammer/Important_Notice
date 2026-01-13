import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "./store";
import VueTheMask from "vue-the-mask";

const app = createApp(App);

app.use(router).use(VueAxios, axios).use(store).use(VueTheMask);

app.mount("#app");
