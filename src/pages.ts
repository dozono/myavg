import background from '../bgs/sunflowerland.jpg'
import yusuke from '../avatar/yusuke.png'
import bgm from '../bgm/dBu music - 不思議な不思議なお祓い棒.flac'
import kaioh from '../avatar/kaioh.png'
import reisen from '../avatar/reisen.png'

export interface Page {
    background: string
    avatar: {
        id: string
        name: string
        image?: string
        position: string
    }[]
    text: {
        content: string
        effect: {

        }
    }
    sceneText: {

    }
    index: number
}
export const pagesData: Page[] = [{
    index: 0,
    background: background,
    avatar: [{
        id: '',
        name: '幽香',
        image: yusuke,
        position: "col-span-2 col-start-1"
    }],
    text: {
        content: `
        站在花田中央的，是有着明亮绿发的高挑少女

她穿着色彩明亮的服装，打着白色的阳伞，脸上带着平和的笑容

微笑着向烈搭话的，正是幻想乡中数一数二的大妖怪，风见幽香`,
        effect: {},
    },
    sceneText: {}
},
{

    index: 1,
    background: background,
    avatar: [{
        id: '',
        name: '烈海王',
        image: kaioh,
        position: "col-span-2 col-start-5"
    }],
    text: {
        content: `
        烈海王，偷袭`,
        effect: {},
    },
    sceneText: {}
},
{

    index: 2,
    background: background,
    avatar: [{
        id: '',
        name: '幽香',
        image: yusuke,
        position: "col-span-2 col-start-5"
    }],
    text: {
        content: `
        烈海王，快使用闪电五连鞭！！！！`,
        effect: {},
    },
    sceneText: {}
},
{

    index: 3,
    background: background,
    avatar: [{
        id: '',
        name: '铃仙',
        image: reisen,
        position: "col-span-2 col-start-5"
    }],
    text: {
        content: `还有就是请尽量不要在我面前表现出过激的战斗欲望，可能会发生不好的事情`,
        effect: {},
    },
    sceneText: {}
}
]