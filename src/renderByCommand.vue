gfddf<script lang=ts setup>
import { computed, reactive, Ref, ref, watch } from "vue";
import { pagesData, Page } from "./pages";
import { AddAndActivateCharacter, Commands, RemoveCharacter, TextBlock, Chat } from "./command";
import dasima from "../bgm/dasima.mp3";
import yusuke from '../avatar/yusuke.png'
import kaioh from '../avatar/kaioh.png'
import backgroundUrl from '../bgs/sunflowerland.jpg'

const commands: Commands[] = [
  {
    type: "setBackground",
    background: backgroundUrl as string,
  },
  {
    type: "choice",
    title: "咲夜现在在吗？【1d2：1】",
    choices: ["在", "不在"],
    selected: 0,
  },
  {
    type: "addAndActivateCharacter",
    name: "yusuke",
    url: yusuke,
    tags: ["站立", "左"],
  },
  {
    type: "addAndActivateCharacter",
    url: kaioh,
    name: "kaioh",
    tags: ["站立", "左"],
  },
  {
    type: 'chat',
    blocks: [
      {
        lines: ['第一行', '第二行']
      },
      {
        lines: ['1第一行', '1第二行', '1第三行']
      },
    ]
  }
];

interface ResolvedCharacter {
  name: string
  tags: string[]
  url: string
}

const index = ref(0);

const choiceTitle = ref("");
const choices = ref([] as string[]);
const selectedChoice = ref(0);

const bgm = ref("");
const background = ref("");

const showChat = ref(false);
const chat = ref([] as string[]);

const sceneText = ref("");

const characters = ref([] as Array<ResolvedCharacter>);
const activeCharacter = ref(0);
const activeCharacterName = computed(() => characters.value[activeCharacter.value]?.name ?? '')

const currentTextIndex = ref(0);
const timeInterval = ref(100);


let _resolve = () => {}
async function waitUserInput() {
  let promise = new Promise<void>((resolve) => {
    _resolve = resolve
  })
  await promise
  console.log('user input')
}

async function processCommand(command:Commands) {
  async function addAndActivateCharacter(command: AddAndActivateCharacter) {
    let index = characters.value.findIndex((v) => {
      return v.name === command.name;
    });
    if (index === -1) {
      characters.value.push({ name: command.name, tags: command.tags, url: command.url as string });
      index = characters.value.length - 1;
    }
    activeCharacter.value = index;
  }
  async function removeCharacter(command: RemoveCharacter) {
    let index = characters.value.findIndex((i) => {
      return i.name === command.name;
    });
    if (index !== -1) {
      characters.value.splice(index, 1);
    }
  }

  async function showChat(command: Chat) {
    for (let block of command.blocks) {
        chat.value = block.lines;
        await waitUserInput()
    }
    // start animate
  }

  for (let command of commands) {
    switch (command.type) {
      case "setBackground":
        background.value = command.background;
        break;
      case "choice":
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
}

async function play(commands: Commands[]) {
  for (let i = 0; i < commands.length; ++i) {
    await processCommand(commands[i])
  }
}

play(commands)

// const animatedChat = computed(() => page.value.text.content.slice(0, currentTextIndex.value))

// animatedText(page.value.text.content.length, timeInterval.value);

// async function animatedText(length: number, timeInterval: number) {
//     for (let i = 0; i < length; i++) {
//         currentTextIndex.value += 1;
//         await new Promise<void>((resolve) => setTimeout(resolve, timeInterval));
//     }
// }

function next() {
  _resolve()
  // if (currentTextIndex.value < page.value.text.content.length) {
  //     currentTextIndex.value = page.value.text.content.length
  // } else {
  //     index.value += 1;
  //     currentTextIndex.value = 0;
  //     animatedText(page.value.text.content.length, timeInterval.value);
  // }
}
</script>

<template>
  <div class="flex h-full items-center justify-center bg-gray-900">
    <div class="bg-no-repeat w-full h-full relative" @click="next">
      <div
        background
        class="absolute z-0 flex items-center justify-center w-full"
      >
        <img :src="background" contain class="z-0" />
      </div>
      <div avatar class="absolute grid grid-row-6 h-full z-10">
        <div class="grid grid-cols-6 row-span-5 relative">
          <!-- <transition name="fade" mode="out-in">
            <div :key="page.index" :class="page.avatar[0].position">
              <img :src="page.avatar[0].image" />
            </div>
          </transition> -->
          <div v-for="char in characters" :key="char.url" class="col-span-2" >
            <transition name="fade" mode="out-in">
              <img :src="char.url" :key="char.url" />
            </transition>
          </div>
        </div>
      </div>
      <div text class="fixed grid grid-row-6 h-full w-full z-10">
        <div class="row-span-4 relative"></div>
        <div class="row-span-1 flex flex-col-reverse">
          <div class="flex pl-2">
            <div
              class="
                bg-opacity-65
                text-3xl
                font-bold
                border border-white border-solid
                rounded
                bg-white
                z-10
                text-center
                py-3
                px-20
              "
            >
              {{ activeCharacterName }}
            </div>
            <div class="flex-grow"></div>
          </div>
        </div>
        <div
          class="
            row-span-1
            flex flex-col
            items-center
            w-full
            justify-center
            bg-opacity-65
            border border-white border-solid
            rounded
            bg-white
            z-10
            px-10
          "
        >
          
          <!-- <div class="text-3xl font-bold w-full text-shadow-md">{{ text }}</div> -->
          <div v-for="line of chat" :key="line" class="text-3xl font-bold w-full text-shadow-md">{{ line }}</div>
        </div>
      </div>
    </div>
  </div>
  <audio :src="bgm" autoplay loop></audio>
</template>

<style>
</style>