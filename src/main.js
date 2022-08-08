import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './static/element/index.scss'
// 全局引入所有element字体图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { ElementPlus } from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router).mount('#app')
