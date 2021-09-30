<script lang=ts setup>
import { computed, reactive, Ref, ref, watch, defineProps } from 'vue'
import { pagesData, Page } from './pages'

defineProps({
    text: String
})

const index = ref(0)
const pages: Ref<Page[]> = ref(pagesData)

const page = computed(() => pages.value[index.value])

const currentTextIndex = ref(0);
const timeInterval = ref(100);

const text = computed(() => page.value.text.content.slice(0, currentTextIndex.value))

animatedText(page.value.text.content.length, timeInterval.value);

async function animatedText(length: number, timeInterval: number) {
    for (let i = 0; i < length; i++) {
        currentTextIndex.value += 1;
        await new Promise<void>((resolve) => setTimeout(resolve, timeInterval));
    }
}

function next() {
    if (currentTextIndex.value < page.value.text.content.length) {
        currentTextIndex.value = page.value.text.content.length
    } else {
        index.value += 1;
        currentTextIndex.value = 0;
        animatedText(page.value.text.content.length, timeInterval.value);
    }
}

c

</script>

<template>
    <div class="text-3xl font-bold w-full text-shadow-md">{{ text }}</div>
</template>

<style>
</style>