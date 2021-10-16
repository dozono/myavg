import { computed, reactive, ref, toRefs } from "vue";
import { RenderableDomText } from "./command";
import bip from '../sounds/sfx-blipmale.wav'

export interface CharacterInfo {
    url: string
    name: string
}

export function useBackground() {
    const background = ref("");
    return { background }
}

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

    return { characters, activeCharacter, activeCharacterName, activeCharacterImage }
}

export function useText() {
    const content = ref([] as RenderableDomText[])

    return { content }
}

export function useChoice() {
    const choice = reactive({
        title: '',
        choices: [] as RenderableDomText[][],
    })

    return { choice }
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
