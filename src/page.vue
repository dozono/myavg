<script lang=ts setup>
import { computed, reactive, Ref, ref, watch } from "vue";
import { pagesData, Page } from "./pages";
import bgm from "../bgm/dasima.mp3";

const bbggmm = bgm;
const index = ref(0);
const pages: Ref<Page[]> = ref(pagesData);
const page = computed(() => pages.value[index.value]);

const currentTextIndex = ref(0);
const timeInterval = ref(100);

const text = computed(() =>
  page.value.text.content.slice(0, currentTextIndex.value)
);

animatedText(page.value.text.content.length, timeInterval.value);

async function animatedText(length: number, timeInterval: number) {
  for (let i = 0; i < length; i++) {
    currentTextIndex.value += 1;
    await new Promise<void>((resolve) => setTimeout(resolve, timeInterval));
  }
}

function next() {
  if (currentTextIndex.value < page.value.text.content.length) {
    currentTextIndex.value = page.value.text.content.length;
  } else {
    if (index.value + 1 >= pages.value.length) {
      return;
    }
    index.value += 1;
    currentTextIndex.value = 0;
    animatedText(page.value.text.content.length, timeInterval.value);
  }
}
</script>

<template>
  <div class="flex h-full items-center justify-center bg-gray-900">
    <div class="bg-no-repeat w-full h-full relative" @click="next">
      <div
        background
        class="absolute z-0 flex items-center justify-center w-full"
      >
        <img :src="page.background" contain class="z-0" />
      </div>
      <div avatar class="absolute grid grid-row-6 h-full z-10">
        <div class="grid grid-cols-6 row-span-5 relative">
          <transition name="fade" mode="out-in">
            <div :key="page.index" :class="page.avatar[0].position">
              <img :src="page.avatar[0].image" />
            </div>
          </transition>
        </div>
      </div>
      <div text class="flex flex-colh-full w-full z-10 pt-2">
        <transition name="fade" mode="out-in">
          <div choices class="pt-55 " v-if="page.choices">
            <div
              v-for="x in page.choices"
              :key="x"
              class="
                z-100
                w-full
                h-full
                text-3xl
                font-bold
                text-center text-white
                
              "
            >
              {{ x }}
            </div>
          </div>
        </transition>
        <div class="row-span-4 relative"></div>
        <div class="row-span-1 flex flex-col-reverse">
          <div class="flex pl-2">
            <div
              v-if="text"
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
              {{ page.avatar[0].name }}
            </div>
            <div class="flex-grow"></div>
          </div>
        </div>
        <div
          v-if="text"
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
          <div class="text-3xl font-bold w-full text-shadow-md">{{ text }}</div>
        </div>
      </div>
      <transition name="fade" mode="out-in">
        <div
          sceneText
          v-if="page.sceneText"
          class="
            font-serif
            italic
            fixed
            w-full
            z-10
            text-6xl text-center
            py-100
            font-bold
            text-shadow-md text-white
          "
        >
          {{ page.sceneText.lines }}
        </div>
      </transition>
    </div>
  </div>

  <audio :src="bbggmm" autoplay loop></audio>
</template>

<style>
</style>