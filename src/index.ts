import 'virtual:windi.css'
import { createApp } from 'vue'
import index from './Renderer.vue'
import { provideStore, useBackground, useCharacters, useChoice, useText } from './store'

provideStore(useCharacters)
provideStore(useBackground)
provideStore(useText)
provideStore(useChoice)

createApp(index).mount('#app')

