import { defineComponent, h, onMounted, VNode } from 'vue';
import { useSound, useStore } from '../store';

export default defineComponent({
    setup() {
        const { bgm, sounds } = useStore(useSound)
        let vdom: Record<string, VNode> = {

        }
        onMounted(() => {
            for (const s of Object.entries(sounds.value)) {
                sounds.value[s[0]].play = () => vdom[s[0]].el!.play()
                sounds.value[s[0]].stop = () => vdom[s[0]].el!.pause()
            }
        })
        return () => {
            const children: VNode[] = []
            for (const s of Object.entries(sounds.value)) {
                console.log(s[1].url)
                const a = h('audio', { src: s[1].url, autoplay: true, loop: false, playsinline: true })
                children.push(a)
                vdom[s[0]] = a
            }
            return h('div', [
                h('audio', { src: bgm.value, autoplay: true, loop: true }),
                ...children
            ])
        }
    }
})
