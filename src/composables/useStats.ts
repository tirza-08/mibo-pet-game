import type { Ref } from 'vue'
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import checkHoursPassed from './../utils/checkHoursPassed'
import getColor from './../utils/getColor'
import playSfx from './../utils/playSfx'

type StatType = 'fullness' | 'energy' | 'happiness' | 'timeElapsed' | 'birthDate'

const baseStats: Record<StatType, number> = {
  fullness: 50,
  energy: 100,
  happiness: 10,
  timeElapsed: Date.now(),
  birthDate: Date.now(),
}

const state = useStorage('stats', baseStats, localStorage)
const sleeping = useStorage('sleeping', false, localStorage)
const color = useStorage('color', getColor(), localStorage)
const name = useStorage('name', '', localStorage)

const daysOld = Math.floor(checkHoursPassed(state.value.birthDate) / 24)

const updateOfflineStats = () => {
  const hoursPassed = checkHoursPassed(state.value.timeElapsed)

  const updateOfflineStat = (stat: StatType, multiplier = 5) => {
    let newStat = state.value[stat] - (hoursPassed * multiplier)
    if (newStat < 10) { newStat = 10 }
    if (newStat > 100) { newStat = 100 }
    state.value[stat] = newStat
  }
  if (!sleeping.value) { updateOfflineStat('energy') }
  else { updateOfflineStat('energy', -5) }
  updateOfflineStat('happiness')
  updateOfflineStat('fullness')
}
updateOfflineStats()

const updateStat = (stat: StatType, amount = 20) => {
  let newStat = state.value[stat] + amount
  // if (state.value[stat] < 10 && amount < 0) { newStat = state.value[stat] - 0.1 }
  state.value.timeElapsed = Date.now()

  if (newStat >= 100) { newStat = 100 }
  else if (newStat <= 0) { newStat = 0 }
  state.value[stat] = newStat
}

const cooldown = ref(false)

watch(cooldown, (value) => {
  if (value) {
    setTimeout(() => {
      cooldown.value = false
    }, 4000)
  }
})

setInterval(() => {
  updateStat('fullness', -0.5)
  updateStat('happiness', -1)

  if (sleeping.value) {
    updateStat('energy', 2)
  }
  else {
    updateStat('energy', -0.2)
  }
}, 8000)

const currentAnimation: Ref<string | null> = ref(null)

export function useStats() {
  const eat = () => {
    if (sleeping.value || cooldown.value) { return }
    playSfx()
    currentAnimation.value = 'eat'
    cooldown.value = true
    updateStat('fullness')
  }
  const rest = () => {
    if (cooldown.value) { return }
    playSfx()

    if (sleeping.value) {
      sleeping.value = false
      currentAnimation.value = 'idle'
    }
    else {
      sleeping.value = true
      currentAnimation.value = 'sleep'
    }
  }
  const pet = () => {
    if (sleeping.value || cooldown.value) { return }
    playSfx()
    updateStat('happiness', 40)
    currentAnimation.value = 'flip'
    cooldown.value = true
  }

  const resetTurtle = () => {
    state.value.fullness = 50
    state.value.energy = 100
    state.value.happiness = 10
    state.value.timeElapsed = Date.now()
    state.value.birthDate = Date.now()
    name.value = ''
    sleeping.value = false
    color.value = getColor()
  }

  return { stats: state, updateStat, eat, rest, pet, sleeping, currentAnimation, color, cooldown, name, daysOld, resetTurtle }
}
