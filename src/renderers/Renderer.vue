<script lang=ts setup>
import { computed, ref } from "vue";
import { templates, usePlayer } from '../player';
import { useStore, useUserInput } from "../store";
import BackgroundRenderer from './BackgroundRenderer.vue';
import CharacterTalkRenderer from './CharacterTalkRenderer.vue';
import ChoiceRenderer from './ChoiceRenderer.vue';
import SoundRenderer from "./SoundRenderer";

const { play, activeTemplates } = usePlayer()
const { onUserInput } = useStore(useUserInput)
const isChoiceActive = computed(() => activeTemplates.value.indexOf(templates.choice) !== -1)
const isTextActive = computed(() => activeTemplates.value.indexOf(templates.text) !== -1)

play()
</script>

<template>
  <div class="flex h-full items-center justify-center bg-gray-900">
    <div class="bg-no-repeat w-full h-full relative" @click="onUserInput">
      <BackgroundRenderer />
      <CharacterTalkRenderer v-if="isTextActive" />
      <ChoiceRenderer v-if="isChoiceActive" />
      <SoundRenderer />
    </div>
  </div>
</template>

<style>
</style>