import { accessSync, createWriteStream, existsSync, promises as fs } from 'fs'
import fetch from 'node-fetch'
import marked, { Tokenizer } from 'marked'
import { join } from 'path'
import { pipeline } from 'stream/promises'
import { format } from 'util'
import { writeFile } from 'fs/promises'
import { render } from './src/markdown/renderer'
import { markDeleted } from './src/markdown/utils'

async function downloadImage(href: string) {
    const splited = href.split('/')
    const name = splited[splited.length - 1]
    const fileName = `images/${name}`
    if (existsSync(fileName)) {
        return
    }
    const r = await fetch(href)
    if (!r.body) {
        return
    }
    const output = createWriteStream(fileName)
    if (r.body) {
        await pipeline(r.body, output)
    }
}

async function handleFile(path: string) {
    let transformed: marked.Token[]

    function walkToken(token: marked.Token, pad: string = '') {
        console.log(JSON.stringify(token, null, 4))
        if (token.type === 'paragraph') {
            for (const t of token.tokens) {
                walkToken(t, pad + '  ')
            }
            return;
        } else if (token.type === 'space') {
            return;
        } else if (token.type === 'image') {
            // all.push(downloadImage(token.href))
            console.log(pad + token.href)
        } else if (token.type === 'text') {
            if (token.text.endsWith(':') && lastToken && lastToken.type === 'image') {
                // transform to 

                lastToken.text = token.text
                markDeleted(token)
            }
            // console.log(pad + token.text)
        } else if (token.type === 'list') {
            console.log(token.items)
        } else if (token.type === 'link') {
            console.log(token.tokens)
            // console.log(token.href)
            // console.log(token.title)
            // console.log(token.text)
        } else if (token.type === 'blockquote') {
            console.log(token.text)
        }
        lastToken = token
    }

    let lastToken: marked.Token
    const content = await fs.readFile(path, 'utf-8')
    const tokenizer = new marked.Tokenizer()

    const lexer = new marked.Lexer({
        tokenizer,
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
                    const reg = /^@(.+):$/g
                    const result = reg.exec(src)
                    if (result && typeof result[1] === 'string') {
                        const [character, ...tags] = result[1].split('#')
                        return { raw: src, type: 'character', character, tags }
                    }
                }
            ]
        }
    } as any)

    const tokens = lexer.lex(content)

    for (const token of tokens) {
        walkToken(token, '')
    }

    const output = render(tokens, true)

    return output
}

async function main() {
    const files = await fs.readdir('./stages')
    for (const file of files.slice(0, 1)) {
        const rendered = await handleFile(join('./stages', file))
        // await writeFile(join('./stages-rendered', file), rendered)
    }
    // const renderered = await handleFile(join('./stages/35.html.md'))
    // await writeFile('./stages/35.html.md', renderered)
}

main()

