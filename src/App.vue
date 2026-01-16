<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import Turtle from './components/models/Turtle.vue'
import UI from './components/UI.vue'
</script>

<template>
  <TresCanvas
    clear-color="#F0DAB1"
    :alpha="true"
    window-size
  >
    <Turtle />
  </TresCanvas>
  <UI />
</template>
