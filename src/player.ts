import { AddAndActivateCharacter, Chat, ChoiceCommand, Commands, RemoveCharacter, SetBackgroundCommand, TextBlock } from "./command";
import { MockBgResolver, MockResolver } from "./mockMapping";
import { CharacterInfo, useBackground, useCharacters, useChoice, useStore, useText } from "./store";
import sample from '../stages/sample.md?raw'
import { createLexer } from "./markdown/lex";
import { compileToCommands } from "./compiler";
import { ref } from "vue";

function resolveCharacter(name: string, tags: string[]): CharacterInfo {
    const sortedTag = tags.sort()

    const url = new MockResolver().resolve(name, sortedTag)

    return {
        name,
        url: url ?? ''
    }
}

export const templates = {
    avatar: 'avatar',
    text: 'text',
    sceneText: 'scene-text',
    choice: 'choice'
}

export function usePlayer() {
    const { characters, activeCharacter } = useStore(useCharacters)
    const { background } = useStore(useBackground)
    const { content } = useStore(useText)
    const { choice } = useStore(useChoice)

    const lex = createLexer()
    const tokens = lex.lex(sample)
    const commands = compileToCommands(tokens)

    console.log(commands)

    const activeTemplates = ref(['avatar', 'text'])

    let _resolve = () => { }
    function onNext() {
        _resolve()
    }
    async function waitUserInput() {
        let promise = new Promise<void>((resolve) => {
            _resolve = resolve
        })
        await promise
    }

    function activate(...templates: string[]) {
        for (const template of templates) {
            if (activeTemplates.value.indexOf(template) === -1) {
                activeTemplates.value.push(template)
            }
        }
    }
    function deactivate(...templates: string[]) {
        for (const template of templates) {
            const i = activeTemplates.value.indexOf(template)
            if (i !== -1) {
                activeTemplates.value.splice(i, 1)
            }
        }
    }

    async function play() {
        for (let i = 0; i < commands.length; ++i) {
            console.log(`process command`)
            console.log(commands[i])
            await processCommand(commands[i])
        }
    }

    async function addAndActivateCharacter(command: AddAndActivateCharacter) {
        let index = characters.value.findIndex((v) => v.name === command.name);
        if (index === -1) {
            characters.value.push(resolveCharacter(command.name, command.tags));
            index = characters.value.length - 1;
        } else {
            characters.value[index].url = new MockResolver().resolve(command.name, command.tags) ?? characters.value[index].url
        }
        activeCharacter.value = index

    }
    async function removeCharacter(command: RemoveCharacter) {
        let index = characters.value.findIndex((i) => i.name === command.name);
        if (index !== -1) {
            characters.value.splice(index, 1);
        }
        activeCharacter.value = -1
    }

    async function setBackgroundCommand(cmd: SetBackgroundCommand) {
        const url = new MockBgResolver().getBackground(cmd.background)
        if (url) {
            background.value = url
        }
    }

    async function showChat(command: Chat) {
        activate(templates.avatar, templates.text)
        for (let block of command.blocks) {
            content.value = block.content
            await waitUserInput()
        }
    }

    async function processTextBlock(command: TextBlock) {
        activate(templates.avatar, templates.text)
        content.value = command.content
        await waitUserInput()
    }

    async function processChoice(command: ChoiceCommand) {
        choice.choices = command.choices
        choice.title = command.title
        activate(templates.choice)
        deactivate(templates.avatar, templates.text)
        await waitUserInput()
        deactivate(templates.choice)
    }

    async function processCommand(command: Commands) {
        switch (command.type) {
            case "textBlock":
                await processTextBlock(command)
                break;
            case "setBackground":
                await setBackgroundCommand(command);
                break;
            case "choice":
                await processChoice(command);
                break;
            case "playSound":
                break;
            case "addAndActivateCharacter":
                await addAndActivateCharacter(command);
                break;
            case "chat":
                await showChat(command)
                break;
            case "removeCharacter":
                await removeCharacter(command);
                break;
            case "sceneText":
                break;
            case "showImage":
                break;
            case "hideImage":
                break;
            case "playBgm":
                break;
            case "pauseBgm":
                break;
        }
    }

    return {
        play,
        onNext,
        activeTemplates,
    }
}
