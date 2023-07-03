import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import scui from './scui'
import i18n from './locales'
import router from './router'
import store from './store'
import App from './App.vue'
import config from '../package.json'

console.log(` %c 里派提供技术支持 %c 当前系统版本号 v${config.version} `, "background:#4caf50;color:#fff;border-radius:3px;padding:5px 0;", "")

const app = createApp(App);

app.use(store);
app.use(router);
app.use(ElementPlus);
app.use(i18n);
app.use(scui);

//挂载app
app.mount('#app');

