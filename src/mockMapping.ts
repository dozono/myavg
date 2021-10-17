import damaged from '../assets/kaioh_damage.jpg'
import sup from '../assets/kaioh_sup.png'
import sweat from '../assets/kaioh_sweat.jpg'
import pico from '../assets/pico.jpg'
import forever from '../bgs/forever.jpg'
import yusuke from '../avatar/yusuke.png'

interface CharacterRenderInfoData {
    url: string
    type?: 'character' | 'avatar'
}

export const mockMapping: Record<string, Record<string, CharacterRenderInfoData>> = {
    '烈海王': {
        '': { url: sweat, type: 'avatar' },
        '受伤': { url: damaged, type: 'avatar' },
        '惊讶': { url: sup, type: 'avatar' },
        '汗': { url: sweat, type: 'avatar' },
    },
    '？？？': {
        '': { url: '' }
    },
    '皮克': {
        '': { url: pico, type: 'avatar' }
    },
    '幽香': {
        '': { url: yusuke }
    }
}


export class MockBgResolver {
    getBackground(name: string): string | undefined {
        if (name === '永远亭') return forever
    }
}


export class MockResolver {
    resolve(name: string, tags: string[]): { url: string, type?: 'character' | 'avatar' } | undefined {
        if (!mockMapping[name]) {
            return undefined
        }
        return mockMapping[name]?.[tags[0] ?? '']
    }
}
