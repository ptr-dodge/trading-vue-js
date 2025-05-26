import { createApp } from 'vue'
import App from './App.vue'

// MOB_DEBUG=true npm run test - Enables mobile debugging
// (sending console output to the webpack terminal)
if (typeof MOB_DEBUG !== 'undefined' && MOB_DEBUG) {
    console.log = debug
    console.error = debug
    console.warn = debug
}


createApp(App).mount('#app')

function debug(...argv) {
    fetch('/debug?argv=' + JSON.stringify(argv))
}
