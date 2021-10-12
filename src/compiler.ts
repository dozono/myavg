import { AddAndActivateCharacter, Chat, ChoiceCommand, Commands, SceneText, SetBackgroundCommand, TextBlock } from './command';
import { Token } from './markdown/lex';

// const src = {
//     type: 'text',
//     text: '"烈，我还以为你是一个老实人，结果这不是过分的要死了吗为什么会出现这种展开啊？？？？？？！！！！！！！！！！！！！！！\n开局就做起了师匠的弟子这种设定写在同人小说里会被人骂的！\n啊，恶饿鬼老师.......原来如此，同人漫画就没有关系了吗'
// }

// const dest = {
//     type: 'textBlock',
//     lines: ['烈，我还以为你是一个老实人，结果这不是过分的要死了吗为什么会出现这种展开啊？？？？？？！！！！！！！！！！！！！！！', "开局就做起了师匠的弟子这种设定写在同人小说里会被人骂的！", "啊，恶饿鬼老师.......原来如此，同人漫画就没有关系了吗"]
// }

interface CompileContext {
    lastChoiceTitle: string
}

function renderTokens(t: Token[], commands: Commands[]): string {
    let result = ''
    for (const sub of t) {
        if (sub.type === 'text') {
            if ('tokens' in sub && sub.tokens) {
                return renderTokens(sub.tokens, commands)
            } else {
                const text = sub.text.replace(/\n/g, '<br>')
                result += `<div>${text}</div>`
            }
        } else if (sub.type === 'strong') {
            const text = sub.text.replace(/\n/g, '<br>')
            result += `<strong>${text}</strong>`
        } else if (sub.type === 'em') {
            const text = sub.text.replace(/\n/g, '<br>')
            result += `<div>${text}</div>`
        }
    }
    return result
}

function compileInline(context: CompileContext, tokens: Token[], result: Commands[]) {
    if (tokens.length === 1) {
        const token = tokens[0]
        if (token.type === 'character') {
            const cmd: AddAndActivateCharacter = {
                type: 'addAndActivateCharacter',
                name: token.character,
                tags: token.tags
            }

            result.push(cmd)
        } else if (token.type === 'scene') {
            const cmd: SetBackgroundCommand = {
                type: 'setBackground',
                background: token.scene
            }

            result.push(cmd)
        } else if (token.type === 'choiceTitle') {
            context.lastChoiceTitle = token.title
        }
        return
    }

    const command: TextBlock = {
        content: renderTokens(tokens, result),
        type: 'textBlock'
    }
    result.push(command)
}

export function compileToCommands(tokens: Token[]): Commands[] {
    const result: Commands[] = []
    console.log(tokens)
    const context: CompileContext = {
        lastChoiceTitle: ''
    }
    for (let i = 0; i < tokens.length; i++) {
        const cur = tokens[i]

        if (cur.type === 'paragraph') {
            compileInline(context, cur.tokens, result)
        } else if (cur.type === 'list') {
            if (context.lastChoiceTitle) {
                const choice: ChoiceCommand = {
                    type: 'choice',
                    title: context.lastChoiceTitle,
                    choices: cur.items.map(e => renderTokens(e.tokens, result)),
                    selected: 0
                }

                result.push(choice)

                context.lastChoiceTitle = ''
            } else {
                // TODO: render as normal text
                // throw new Error("FUCK UP")
            }
        } else if (cur.type === 'code') {
            if (cur.codeBlockStyle === "indented") {
                const cmd: SceneText = {
                    type: 'sceneText',
                    lines: cur.text.split('\n')
                }
                result.push(cmd)
            } else if (cur.lang === 'js') {

            }
        } else if (cur.type === 'blockquote') {
            const cmd: Chat = {
                type: 'chat',
                blocks: []
            }
            for (const t of cur.tokens) {
                if (t.type === 'paragraph') {
                    cmd.blocks.push({
                        type: 'textBlock',
                        content: renderTokens(t.tokens, result)
                    })
                }
            }

            result.push(cmd)
        }
    }
    return result
}