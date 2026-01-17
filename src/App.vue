<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import Turtle from './components/models/Turtle.vue'
import UI from './components/UI.vue'
import { useStats } from './composables/useStats'

const { color } = useStats()
</script>

<template>
  <TresCanvas
    :clear-color="color === 'purple' ? '#87A2DC' : color === 'pink' ? '#93D4B5' : '#F0DAB1'"
    :alpha="true"
    window-size
  >
    <Turtle />
  </TresCanvas>
  <UI />
</template>
