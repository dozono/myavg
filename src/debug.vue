<template>
  <div class="flex gap-10 flex-col w-full h-full items-center text-white">
    <div>
      {{ sample }}
    </div>
    <div class="flex flex-col gap-10">
      <div v-for="c in commands">
        {{c}}
      </div>
      <!-- {{ commands }} -->
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import sample from "../stages/sample.md?raw";
import { compileToCommands } from "./compiler";
import { createLexer } from "./markdown/lex";

export default defineComponent({
  setup() {
    const lexer = createLexer();
    const tokens = lexer.lex(sample);
    const commands = compileToCommands(tokens);
    return {
      sample,
      commands,
    };
  },
});
</script>

<style>
</style>