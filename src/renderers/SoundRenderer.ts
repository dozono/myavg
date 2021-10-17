import { defineComponent, h, onMounted, VNode } from 'vue';
import { useSound, useStore } from '../store';



export default defineComponent({
    setup() {
        const { bgm, sounds } = useStore(useSound)

        return () => {
            const children: VNode[] = []
            return h('div', [
                h('audio', { src: bgm.value, autoplay: true, loop: true }),
                ...children
            ])
        }
    }
})
