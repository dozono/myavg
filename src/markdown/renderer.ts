import { format } from "util"
import { isDeleted } from "./utils"

function renderCustomToken(token: any) {
    if (token.type === 'scene') {
        return `~${token.scene}~`
    } else if (token.type === 'character') {
        return `@${token.character}${token.tags.map((t: string) => '#' + t).join('')}`
    }
}

export function render(tokens: marked.Token[], top: boolean) {
    let out = ''
    let body = ''
    const l = tokens.length
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (isDeleted(token)) {
            continue;
        }
        switch (token.type) {
            case 'paragraph':
                out += renderInline(token.tokens) + '\n'
                break
            case 'html':
                out += token.text + '\n'
                break;
            case 'space':
                out += '\n\n'
                break;
            case 'hr':
                out += '---\n\n'
                break;
            case 'heading':
                out += new Array(token.depth).fill("#") + " " + renderInline(token.tokens)
                break;
            case 'code':
                out += "```" + (token.lang ?? "") + "\n" + token.text + "\n" + "```\n"
                break;
            case 'blockquote':
                out += `> ${token.text}\n`
                break;
            case 'list':
                out += (token.ordered
                    ? token.items.map((item, index) => `${index + 1}. ${renderInline(item.tokens)}\n`).join('')
                    : token.items.map((item) => `- ${renderInline(item.tokens)}\n`).join('')) + '\n'
                break;
            case 'text':
                body = 'tokens' in token && token.tokens ? renderInline(token.tokens) : token.text;
                while (i + 1 < l && tokens[i + 1].type === 'text') {
                    token = tokens[++i];
                    if (token.type !== 'text') {
                        throw new Error();
                    }
                    body += '\n' + ('tokens' in token && token.tokens ? renderInline(token.tokens) : token.text);
                }
                out += top ? `${body}\n` : `${body}\n`;
                break
        }
        const customResult = renderCustomToken(token)
        if (customResult) {
            out += customResult + '\n'
        }
    }
    return out;
}

function renderInline(tokens: marked.Token[]) {
    let out = ''
    for (const token of tokens) {
        if (isDeleted(token)) {
            continue;
        }
        switch (token.type) {
            case 'escape':
                out += token.text;
                break
            case 'html':
                out += token.text;
                break
            case 'link':
                out += `[${renderInline(token.tokens)}](${token.href})`
                break
            case 'image':
                out += `![${token.text}](${token.href})`
                break
            case 'strong':
                out += `**${renderInline(token.tokens)}**`
                break
            case 'em':
                out += `*${renderInline(token.tokens)}*`
                break
            case 'codespan':
                out += "`" + token.text + "`"
                break
            case 'br':
                out += '\n'
                break
            case 'del':
                out += `~~${renderInline(token.tokens)}~~`
                break
            case 'text':
                out += token.text
                break
        }
        const customResult = renderCustomToken(token)
        if (customResult) {
            out += customResult
        }
    }
    return out;
}