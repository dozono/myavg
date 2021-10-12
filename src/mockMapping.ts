import damaged from '../assets/kaioh_damage.jpg'
import sup from '../assets/kaioh_sup.png'
import sweat from '../assets/kaioh_sweat.jpg'
import pico from '../assets/pico.jpg'
import forever from '../bgs/forever.jpg'


export const mockMapping: Record<string, Record<string, string>> = {
    '烈海王': {
        '': sweat,
        '受伤': damaged,
        '惊讶': sup,
        '汗': sweat,
    },
    '？？？': {
        '': ''
    },
    '皮克': {
        '': pico
    }
}


export class MockBgResolver {
    getBackground(name: string): string | undefined {
        if (name === '永远亭') return forever
    }
}


export class MockResolver {
    resolve(name: string, tags: string[]): string | undefined {
        if (!mockMapping[name]) {
            return undefined
        }
        return mockMapping[name]?.[tags[0] ?? '']
    }
}
