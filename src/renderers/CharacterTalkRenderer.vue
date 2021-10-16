<script lang=ts setup>
import { useCharacters, useStore, useText } from '../store';

import renderText from './renderText';

const { activeCharacterName, characters } = useStore(useCharacters)
const { content } = useStore(useText)

</script>

<template>
    <div avatar class="absolute grid grid-row-3 h-full z-10">
        <div class="row-span-1">
            <div class="grid grid-cols-6">
                <div
                    v-for="char in characters"
                    :key="char.url"
                    class="col-span-2 flex flex-col items-center justify-center"
                >
                    <transition name="fade" mode="out-in">
                        <img :src="char.url" :key="char.url" />
                    </transition>
                </div>
            </div>
        </div>
    </div>
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
                <renderText :contents="content" />
            </div>
        </div>
    </div>
</template>

<style>
</style>