import { computed, defineComponent, h, onMounted, reactive, ref, watch } from 'vue'
import { RenderableDomText } from '../command'
import { useSound, useStore } from '../store'
import { optional, required } from '../utils/props'

export default defineComponent({
    props: {
        contents: required<RenderableDomText[]>(Array),
        flush: optional<() => void>(Function as any)
    },
    emits: ['finish'],
    setup(props, context) {
        const status = ref([] as number[])
        const { playSound, stopSound } = useStore(useSound)
        const lengths = computed(() => props.contents.map(c => c.text.length))
        const totalLength = computed(() => lengths.value.reduce((a, b) => a + b, 0))
        function getLength(i: number) {
            return status.value[i]
        }
        watch(() => props.contents, () => {
            status.value = new Array(props.contents.length).fill(0)
            startAnimation()
        })
        status.value = new Array(props.contents.length).fill(0)

        const index = computed({
            get() {
                return status.value.reduce((a, b) => a + b, 0)
            },
            set(x: number) {
                let remaining = x
                for (let i = 0; i < props.contents.length; ++i) {
                    const text = props.contents[i].text
                    if (remaining > text.length) {
                        remaining -= text.length
                        status.value[i] = lengths.value[i]
                    } else {
                        status.value[i] = remaining
                        break
                    }
                }
            },
        })

        let handle: any
        function startAnimation() {
            handle = setInterval(() => {
                if (index.value < totalLength.value) {
                    index.value += 1
                    playSound('bip')
                } else {
                    clearInterval(handle)
                    context.emit('finish')
                    stopSound('bip')
                }
            }, 100)
        }
        function flush() {
            index.value = totalLength.value
            clearInterval(handle)
            context.emit('finish')
        }

        onMounted(() => {
            startAnimation()
        })
        return () => h('div', props.contents.map((c, i) => h(c.tag, { style: c.style }, [c.text.slice(0, getLength(i))])))
    }
})