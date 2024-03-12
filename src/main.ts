// import Previewer from 'virtual:vue-component-preview'
import App from './App.vue'
import { install } from './modules'

import './styles/reset.scss'
import './styles/main.scss'
import './styles/animate.scss'

import './styles/tailwindcss.css'

import 'virtual:svg-icons-register'
import './modules/vue-request'
import 'feie-ui/dist/style.css'

globalInit().then(async () => {
  const app = createApp(App)
  await install(app)
  app.mount('#app')
}).catch((err) => {
  console.error('err', err)
})
