<script lang=ts setup>
import { computed, reactive, Ref, ref, watch } from "vue";
import { AddAndActivateCharacter, Commands, RemoveCharacter, TextBlock, Chat } from "./command";
import AvatarRenderer from './AvatarRenderer.vue'
import TextRenderer from './TextRenderer.vue'
import BackgroundRenderer from './BackgroundRenderer.vue'
import ChoiceRenderer from './ChoiceRenderer.vue'
import { usePlayer, templates } from './player'

const bgm = ref("");

const { play, onNext, activeTemplates } = usePlayer()
const isChoiceActive = computed(() => activeTemplates.value.indexOf(templates.choice) !== -1)
const isTextActive = computed(() => activeTemplates.value.indexOf(templates.text) !== -1)
const isAvatarActive = computed(() => activeTemplates.value.indexOf(templates.avatar) !== -1)

play()
</script>

<template>
  <div class="flex h-full items-center justify-center bg-gray-900">
    <div class="bg-no-repeat w-full h-full relative" @click="onNext">
      <BackgroundRenderer />
      <AvatarRenderer v-if="isAvatarActive" />
      <TextRenderer v-if="isTextActive" />
      <ChoiceRenderer v-if="isChoiceActive" />
    </div>
  </div>
  <!-- <audio :src="bgm" autoplay loop></audio> -->
</template>

<style>
</style>