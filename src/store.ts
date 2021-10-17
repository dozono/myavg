import { computed, isReadonly, onMounted, reactive, ref, toRefs } from "vue";
import { RenderableDomText } from "./command";
import bip from '../sounds/sfx-blipmale.wav'
import { AudioBufferSourceManager } from "./audio";
import SoundRenderer from "./renderers/SoundRenderer";

export interface CharacterInfo {
    url: string
    renderType: 'avatar' | 'character'
    name: string
}

export function useBackground() {
    const background = ref("");
    return { background }
}

const audioManager = new AudioBufferSourceManager()

export function useSound() {
    const data = reactive({
        bgm: '',
        sounds: {
            'bip': {
                url: bip,
                play: () => { },
                stop: () => { }
            },
        } as Record<string, { url: string, play: () => void, stop: () => void }>,
    })

    async function load() {
        console.log('sounds')
        for (const [name, metadata] of Object.entries(data.sounds)) {
            const buf = await audioManager.getAudioBuffer(metadata.url)
            data.sounds[name].play = () => {
                const source = audioManager.context.createBufferSource()
                source.buffer = buf
                source.connect(audioManager.context.destination)

                source.start()

                data.sounds[name].stop = () => {
                    console.log('stop!')
                    source.stop()
                }
            }
        }
    }

    function playSound(name: string) {
        if (data.sounds[name]) {
            data.sounds[name].play()
        }
    }

    function stopSound(name: string) {
        if (data.sounds[name]) {
            data.sounds[name].stop()
        }
    }

    onMounted(() => {
        load()
    })

    return {
        ...toRefs(data),
        playSound,
        stopSound,
    }
}

export function useCharacters() {
    const characters = ref([] as Array<CharacterInfo>);
    const activeCharacter = ref(0);
    const activeCharacterName = computed(() => characters.value[activeCharacter.value]?.name ?? '')
    const activeCharacterImage = computed(() => characters.value[activeCharacter.value]?.url ?? '')
    const activeCharacterType = computed(() => characters.value[activeCharacter.value]?.renderType ?? '')

    return { characters, activeCharacter, activeCharacterName, activeCharacterImage, activeCharacterType }
}

export function useText() {
    const content = ref([] as RenderableDomText[])
    const isText = ref(false)

    return { content, isText }
}

export function useChoice() {
    const choice = reactive({
        title: '',
        choices: [] as RenderableDomText[][],
    })

    return { choice }
}


export function useUserInput() {
    let userInputWaitQueue: Array<() => void> = []

    function onUserInput() {
        const next = userInputWaitQueue.shift()
        if (next) {
            next()
        }
    }

    async function waitUserInput() {
        let promise = new Promise<void>((resolve) => {
            userInputWaitQueue.unshift(resolve)
        })
        await promise
    }

    return {
        waitUserInput,
        onUserInput,
    }
}

const store = new Map<Function, any>()

export function useStore<T, A>(f: (...args: A[]) => T): T {
    if (store.has(f)) {
        return store.get(f)
    } else {
        throw new Error()
    }
}


export function provideStore<T, A>(f: (...args: A[]) => T, ...args: A[]): void {
    store.set(f, f(...args))
}


