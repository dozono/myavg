import { computed, reactive, ref, toRefs } from "vue";

export interface CharacterInfo {
    url: string
    name: string
}

export function useBackground() {
    const background = ref("");
    return { background }
}

export function useCharacters() {
    const characters = ref([] as Array<CharacterInfo>);
    const activeCharacter = ref(0);
    const activeCharacterName = computed(() => characters.value[activeCharacter.value]?.name ?? '')
    const activeCharacterImage = computed(() => characters.value[activeCharacter.value]?.url ?? '')

    return { characters, activeCharacter, activeCharacterName, activeCharacterImage }
}

export function useText() {
    const blocks = ref([] as string[])
    const content = ref("")

    return { blocks, content }
}

export function useChoice() {
    const choice = reactive({
        title: '',
        choices: [] as string[],
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
