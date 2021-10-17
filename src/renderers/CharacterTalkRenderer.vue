<script lang=ts setup>
import { computed } from "vue";
import { CharacterInfo, useCharacters, useStore, useText } from "../store";
import RenderText from "./RenderText";

const fullChars = computed(() =>
  characters.value.filter((c) => c.renderType === "character")
);

const {
  activeCharacterName,
  characters,
  activeCharacterType,
  activeCharacterImage,
} = useStore(useCharacters);

const { content, isText } = useStore(useText);

function getClass(render: CharacterInfo) {
  console.log(render);
  if (render.renderType === "avatar") {
    return "flex items-center rounded";
  } else {
    return "flex ";
  }
}
function unactiveCharDim(name: string) {
  if (name === activeCharacterName.value) {
    return "";
  } else {
    return "opacity-70 ";
  }
}
</script>

<template>
  <div avatar class="absolute z-10 w-full h-full">
    <div class="flex w-full h-full">
      <div
        class="flex"
        v-for="char in fullChars"
        :key="char.url"
        :class="getClass(char)"
      >
        <transition name="fade" mode="out-in">
          <img
            :src="char.url"
            :key="char.url"
            class="rounded-2xl transform-gpu"
            :class="unactiveCharDim(char.name)"
          />
        </transition>
      </div>
    </div>
  </div>
  <div text class="fixed grid grid-row-6 h-full w-full z-10">
    <div class="row-span-4 relative"></div>
    <div
      class="
        m-5
        row-span-1
        flex
        items-center
        justify-center
        bg-opacity-65
        border border-white border-solid
        rounded
        bg-white
        z-10
        px-10
      "
    >
      <div v-if="!isText">
        <img
          v-if="activeCharacterType === 'avatar'"
          :src="activeCharacterImage"
          height="320"
          width="320"
          class="rounded-2xl"
        />
      </div>
      <div class="w-full px-10 grid grid-rows-3">
        <div
          v-if="!isText"
          class="row-span-1 text-3xl font-bold py-3 whitespace-nowrap"
        >
          {{ activeCharacterName }}
        </div>
        <div
          class="row-span-2 text-5xl font-bold w-full text-shadow-md leading-20"
        >
          <RenderText :contents="content" animated />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>