import 'virtual:windi.css'
import { createApp, defineComponent, h } from 'vue'
import index from './renderers/Renderer.vue'
import { provideStore, useBackground, useCharacters, useChoice, useSound, useText, useUserInput } from './store'


createApp(defineComponent({
    setup() {
        provideStore(useCharacters)
        provideStore(useBackground)
        provideStore(useText)
        provideStore(useChoice)
        provideStore(useSound)
        provideStore(useUserInput)

        return () => h(index)
    }
})).mount('#app')

