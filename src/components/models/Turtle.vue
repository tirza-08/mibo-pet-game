<script setup lang="ts">
import { OrbitControls, useAnimations, useGLTF } from '@tresjs/cientos'
import { computed, ref, watch } from 'vue'
import { useStats } from './../../composables/useStats'
import { LoopRepeat } from 'three'
import getRandomNumber from './../../utils/getRandomNumber'

const { sleeping, currentAnimation, color } = useStats()

let filepath = '/models/myturtle3.glb'

switch (color.value) {
  case 'green':
    filepath = '/models/myturtle3.glb'
    break
}

const { state: model, nodes } = useGLTF(filepath)

const animations = computed(() => model.value?.animations ?? [])
const rig = computed(() => nodes.value.Scene)
const { actions } = useAnimations(animations, rig)

const resetAnimation = () => {
  currentAnimation.value = 'idle'
}

const getIdle = () => {
  const idleAnimations = ['swim', 'swim.001']
  const idle = idleAnimations[getRandomNumber(idleAnimations.length)]
  return idle
}

watch(currentAnimation, (newAnimation) => {
  if (!newAnimation) { return }

  actions.swim?.stop()
  actions['swim.001']?.stop()
  actions.sleep?.stop()

  if (newAnimation === 'idle') {
    const idle = getIdle()
    const idleAction = actions[idle]
    idleAction?.fadeIn(0.4).play()
    return
  }

  const action = actions[newAnimation]

  if (newAnimation === 'sleep') {
    action?.reset().fadeIn(0.4).play().setLoop(LoopRepeat, Infinity)
    return
  }

  action?.reset().fadeIn(0.1).play().setLoop(LoopRepeat, 1)

  const mixer = action?.getMixer()
  mixer?.removeEventListener('finished', resetAnimation)
  mixer?.addEventListener('finished', resetAnimation)
})

const x = ref(0)
const y = ref(0)
const z = ref(0)
</script>

<template>
  <TresPerspectiveCamera :position="[1, 0.2, 2]" :look-at="[0, 0, 0]" />
  <OrbitControls :max-distance="20" :min-distance="2" />
  <TresAmbientLight
    :intensity="2"
    color="white"
  />
  <TresDirectionalLight
    v-if="!sleeping"
    :position="[0, 2, 4]"
    :intensity="0.5"
  />
  <!-- <primitive v-if="turtle" :object="turtle" :rotation="[x, y, z]" /> -->
  <primitive v-if="rig" :object="rig" :rotation="[x, y, z]" />
  <!-- <TresAxesHelper /> -->
</template>
