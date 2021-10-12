import marked from 'marked'

export type Token = marked.Token | {
    type: 'scene';
    scene: string
    raw: string;
} | {
    type: 'character';
    raw: string
    character: string
    tags: string[]
} | {
    type: 'choiceTitle'
    title: string
    raw: string
}

export function createLexer() {
    const lexer = new marked.Lexer({
        extensions: {
            inline: [
                function (this: marked.Lexer, src: string, tokens: marked.Token[]) {
                    const matchScene = /^~(.+)~$/g
                    const result = matchScene.exec(src)
                    if (result && typeof result[1] === 'string') {
                        return { raw: src, type: 'scene', scene: result[1] }
                    }
                },
                function (this: marked.Lexer, src: string, tokens: marked.Token[]) {
                    const reg = /^@(.+)$/g
                    const result = reg.exec(src)
                    if (result && typeof result[1] === 'string') {
                        const [character, ...tags] = result[1].split('#')
                        return { raw: src, type: 'character', character, tags }
                    }
                },
                function (this: marked.Lexer, src: string, tokens: marked.Token[]) {
                    const reg = /^\?(.+)$/g
                    const result = reg.exec(src)
                    if (result && typeof result[1] === 'string') {
                        return { raw: src, type: 'choiceTitle', title: result[1] }
                    }
                },
                // function (this: marked.Lexer, src: string, tokens: marked.Token[]) {
                //     const reg = /\{(.+)\}/g
                //     const result = reg.exec(src)
                //     if (result && typeof result[1] === 'string') {
                //         return { raw: src, type: 'soundEffect', sound: result[1] }
                //     }
                // }
            ]
        }
    } as any)
    return lexer
}
