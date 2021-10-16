import { AddAndActivateCharacter, Chat, ChoiceCommand, Commands, RenderableDomText, SceneText, SetBackgroundCommand, TextBlock } from './command';
import { Token } from './markdown/lex';

interface CompileContext {
    lastChoiceTitle: string
}


function renderTokensToDom(t: Token[], commands: Commands[]): RenderableDomText[] {
    let result: RenderableDomText[] = []
    for (const sub of t) {
        if (sub.type === 'text') {
            if ('tokens' in sub && sub.tokens) {
                result.push(...renderTokensToDom(sub.tokens, commands))
            } else {
                const text = sub.text.replace(/\n/g, '<br>')
                result.push({ text, tag: 'span' })
            }
        } else if (sub.type === 'strong') {
            const text = sub.text.replace(/\n/g, '<br>')
            result.push({ tag: 'strong', text })
        } else if (sub.type === 'em') {
            const text = sub.text.replace(/\n/g, '<br>')
            result.push({ tag: 'span', text, style: 'font-style: italic' })
        }
    }
    return result
}

function renderTokens(t: Token[], commands: Commands[]): string {
    let result = ''
    for (const sub of t) {
        if (sub.type === 'text') {
            if ('tokens' in sub && sub.tokens) {
                return renderTokens(sub.tokens, commands)
            } else {
                const text = sub.text.replace(/\n/g, '<br>')
                result += `<span>${text}</span>`
            }
        } else if (sub.type === 'strong') {
            const text = sub.text.replace(/\n/g, '<br>')
            result += `<strong>${text}</strong>`
        } else if (sub.type === 'em') {
            const text = sub.text.replace(/\n/g, '<br>')
            result += `<span class="font-style: italic">${text}</span>`
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
            return
        } else if (token.type === 'scene') {
            const cmd: SetBackgroundCommand = {
                type: 'setBackground',
                background: token.scene
            }
            result.push(cmd)
            return
        } else if (token.type === 'choiceTitle') {
            context.lastChoiceTitle = token.title
            return
        }
    }

    const command: TextBlock = {
        content: renderTokensToDom(tokens, result),
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
                    choices: cur.items.map(e => renderTokensToDom(e.tokens, result)),
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
                        content: renderTokensToDom(t.tokens, result)
                    })
                }
            }

            result.push(cmd)
        }
    }
    return result
}