<script lang=ts setup>
import { useStore, useBackground } from '../store'

const { background } = useStore(useBackground)

</script>
<template>
    <div background class="absolute z-0 flex items-center justify-center w-full">
        <img :src="background" contain class="z-0" />
    </div>
</template>