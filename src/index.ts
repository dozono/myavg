import 'virtual:windi.css'
import { createApp } from 'vue'
import index from './renderers/Renderer.vue'
import { provideStore, useBackground, useCharacters, useChoice, useSound, useText } from './store'

provideStore(useCharacters)
provideStore(useBackground)
provideStore(useText)
provideStore(useChoice)
provideStore(useSound)

createApp(index).mount('#app')

