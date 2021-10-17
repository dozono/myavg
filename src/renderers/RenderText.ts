import { computed, defineComponent, h, onMounted, ref, watch } from 'vue'
import { RenderableDomText } from '../command'
import { useSound, useStore, useUserInput } from '../store'
import { optional, required, withDefault } from '../utils/props'

export default defineComponent({
    props: {
        contents: required<RenderableDomText[]>(Array),
        flush: optional<() => void>(Function as any),
        animated: withDefault(Boolean, () => false),
    },
    emits: ['finish'],
    setup(props, context) {
        const status = ref([] as number[])
        const { playSound } = useStore(useSound)
        const { waitUserInput } = useStore(useUserInput)
        const lengths = computed(() => props.contents.map(c => c.text.length))
        const totalLength = computed(() => lengths.value.reduce((a, b) => a + b, 0))
        
        function getLength(i: number) {
            return status.value[i]
        }
        watch(() => props.contents, () => {
            status.value = new Array(props.contents.length).fill(0)
            waitUserInput().then(() => {
                flush()
            })
            startAnimation()
        })
        status.value = new Array(props.contents.length).fill(0)

        const currentChar = computed(() => {
            let remaining = index.value
            for (let i = 0; i < props.contents.length; ++i) {
                const text = props.contents[i].text
                if (remaining > text.length) {
                    remaining -= text.length
                } else {
                    return text[remaining]
                }
            }
        })
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

        let soundHandle = 0
        let animationHandle = 0
        function startSound() {
            if (!soundHandle) {
                soundHandle = setInterval(() => {
                    playSound('bip')
                }, 80) as any as number
            }
        }
        function stopSound() {
            clearInterval(soundHandle)
            soundHandle = 0
        }
        const pauseChars = ['，', '。', '！', '？', '【', '】', '.', ':', '：', "…", '(', ')', '）', '（']
        function animate() {
            if (index.value < totalLength.value) {
                index.value += 1
                if (pauseChars.indexOf(currentChar.value ?? '') !== -1) {
                    stopSound()
                } else {
                    startSound()
                }
            } else {
                console.log('clear interval')
                clearInterval(animationHandle)
                stopSound()
                animationHandle = 0
                context.emit('finish')
            }
        }
        function startAnimation() {
            if (!props.animated) {
                return
            }
            startSound()
            if (!animationHandle) {
                animationHandle = setInterval(() => {
                    animate()
                }, 50) as any as number
            }
        }
        function flush() {
            index.value = totalLength.value
            stopSound()
            context.emit('finish')
        }

        onMounted(() => {
            if (props.animated) {
                startAnimation()
            } else {
                index.value = totalLength.value
            }
        })
        return () => h('div', props.contents.map((c, i) => h(c.tag, { style: c.style }, [c.text.slice(0, getLength(i))])))
    }
})