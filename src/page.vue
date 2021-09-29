<script lang=ts setup>
import { computed, reactive, ref } from 'vue'
import background from '../bgs/sunflowerland.jpg'
import yusuke from '../avatar/yusuke.png'
// import bgm from '../bgm/dBu music - 不思議な不思議なお祓い棒.flac'
import bgm from '../bgm/dasima.mp3'

interface Page {
    background: string
    avatar: {
        id: string
        image?: string
        position: [number, number, number]
    }[]
    text: {
        content: string
        effect: {

        }
    }
    sceneText: {

    }
}

const page = ref({
    background: background,
    avatar: [{
        id: '',
        image: yusuke,
        position: [0, 0, 0]
    }],
    text: {
        content: `
        站在花田中央的，是有着明亮绿发的高挑少女

她穿着色彩明亮的服装，打着白色的阳伞，脸上带着平和的笑容

微笑着向烈搭话的，正是幻想乡中数一数二的大妖怪，风见幽香`,
        effect: {},
    },
    sceneText: {}
})

</script>

<template>
    <div class="flex h-full items-center justify-center bg-gray-900">
        <div class="bg-no-repeat w-full h-full relative">
            <div class="absolute z-0 flex items-center justify-center w-full">
                <img :src="page.background" contain class="z-0" />
            </div>
            <div class="absolute grid grid-row-6 h-full z-10">
                <div class="row-span-5 relative">
                    <!-- <div class="absolute"> -->
                    <img :src="page.avatar[0].image" />
                    <!-- </div> -->
                </div>
            </div>
            <div class="fixed grid grid-row-6 h-full z-10">
                <!-- <div class="row-span-5 relative">
                    <div class="absolute">
                        <img :src="page.avatar[0].image" />
                    </div>
                </div>-->
                <div
                    class="flex flex-col items-center justify-center bg-opacity-65 border border-white border-solid rounded row-start-6 bg-white z-10 px-10"
                >
                    <div
                        class="text-3xl font-bold text-center text-shadow-md"
                    >{{ page.text.content }}</div>
                </div>
            </div>
        </div>
    </div>
    <audio :src="bgm" autoplay loop></audio>
</template>

<!-- <style>
.root {
    background-image: url(--bg);
}
</style> -->