<script lang=ts setup>
import { computed, reactive, Ref, ref, watch, defineProps } from 'vue'
import { useStore, useCharacters, useText } from './store'

const { activeCharacterName } = useStore(useCharacters)
const { content } = useStore(useText)

</script>

<template>
    <div text class="fixed grid grid-row-6 h-full w-full z-10">
        <div class="row-span-4 relative"></div>
        <div class="row-span-1 flex flex-col-reverse">
            <div class="flex pl-2">
                <div
                    class="bg-opacity-65 text-3xl font-bold border border-white border-solid rounded bg-white z-10 text-center py-3 px-20"
                >{{ activeCharacterName }}</div>
                <div class="flex-grow"></div>
            </div>
        </div>
        <div
            class="row-span-1 flex items-center w-full justify-center bg-opacity-65 border border-white border-solid rounded bg-white z-10 px-50"
        >
            <div class="text-5xl font-bold w-full text-shadow-md leading-20">
                <div v-html="content"></div>
            </div>
            <!-- <div
                v-for="block of blocks"
                :key="block"
                class="text-3xl font-bold w-full text-shadow-md"
            ><div v-html="block"></div></div>-->
        </div>
    </div>
</template>

<style>
</style>