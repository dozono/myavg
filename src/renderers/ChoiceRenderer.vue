<script lang=ts setup>
import { useStore, useChoice, useCharacters } from '../store'

const { choice } = useStore(useChoice)
const { activeCharacterImage } = useStore(useCharacters)

</script>
<template>
    <div choice class="absolute z-0 flex items-center justify-center w-full h-full">
        <div class="grid grid-cols-3 scene-text p-50">
            <div class="col-span-1">
                <img :src="activeCharacterImage" />
                <div class="text-center text-6xl leading-20">{{ choice.title }}</div>
            </div>
            <div class="col-span-2 flex flex-col items-center">
                <div class="flex flex-col gap-5">
                    <span v-for="(c, i) in choice.choices" :key="c" class="flex gap-2">
                        <span>{{ i + 1 }}.</span>
                        <span v-html="c" />
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>