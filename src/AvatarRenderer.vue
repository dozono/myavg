<script lang=ts setup>
import { useStore, useCharacters } from './store'

const { characters } = useStore(useCharacters)

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
</template>