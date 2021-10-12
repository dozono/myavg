export interface Command {
    type: string
}

/**
 * 代表一次出现的文字 
 */
export interface TextBlock {
    type: 'textBlock'
    /**
     * HTML content
     */
    content: string
}

export interface SetBackgroundCommand extends Command {
    type: 'setBackground'
    background: string
}

export interface ChoiceCommand extends Command {
    type: 'choice',
    title: string
    choices: string[]
    selected: number
}



export interface AddAndActivateCharacter extends Command {
    type: 'addAndActivateCharacter',
    name: string
    tags: string[]
}

export interface Chat extends Command {
    type: 'chat'
    blocks: TextBlock[]
}

export interface RemoveCharacter extends Command {
    type: 'removeCharacter'
    name: string
}

export interface SceneText extends Command {
    type: 'sceneText'
    lines: string[]
}

export interface ShowImage extends Command {
    type: 'showImage'
    url: string
    tags: string[]
}

export interface HideImage extends Command {
    type: 'hideImage'
    url: string
}

export interface PlayBgm extends Command {
    type: 'playBgm'
}

export interface PauseBgm extends Command {
    type: 'pauseBgm'
}

export interface PlaySound extends Command {
    type: 'playSound'
}

export type Commands =
    TextBlock |
    SetBackgroundCommand |
    ChoiceCommand |
    AddAndActivateCharacter |
    Chat |
    RemoveCharacter |
    SceneText |
    ShowImage |
    HideImage |
    PlayBgm |
    PauseBgm |
    PlaySound