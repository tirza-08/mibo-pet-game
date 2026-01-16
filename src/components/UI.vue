<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useStats } from './../composables/useStats'
import PopUp from './common/PopUp.vue'

const { stats, eat, rest, pet, sleeping, cooldown, name, daysOld, resetTurtle } = useStats()
const getHeight = (percentage: number) => {
  return `${(percentage / 100) * 100}px`
}

const showModal = ref(false)
const showDeath = ref(false)

const turtleImage = computed(() => {
  if (stats.value.energy === 0 || stats.value.fullness === 0) {
    return 'dead.png'
  }
  if (sleeping.value) { return 'turtle-sleepy.png' }

  if (stats.value.energy > 50 && stats.value.fullness > 80 && stats.value.happiness > 80) { return 'turtle-happy.png' }
  if (stats.value.energy < 20 || stats.value.fullness < 20 || stats.value.happiness < 20) { return 'turtle-low.png' }

  return 'turtle.png'
})

watch(
  () => [stats.value.energy, stats.value.fullness],
  ([energy, fullness]) => {
    if (energy === 0 || fullness === 0) {
      showDeath.value = true
    }
  },
  { immediate: true },
)

const bgMusic = new Audio('/sounds/bg.mp3')

const playMusic = () => {
  bgMusic.volume = 0.02
  bgMusic.play()
  bgMusic.loop = true
  document.removeEventListener('music', playMusic)
}

document.addEventListener('click', () => {
  document.dispatchEvent(new Event('music'))
}, { once: true })

document.addEventListener('music', playMusic)

if (!name.value) { showModal.value = true }

const inputName = ref('')
const submitName = () => {
  if (inputName.value) { name.value = inputName.value }
  else {
    name.value = 'Mibo'
  }
  inputName.value = ''
  showModal.value = false
}

const restart = () => {
  showDeath.value = false
  resetTurtle()
  showModal.value = true
}

const musicOn = ref(true)

const toggleMusic = () => {
  if (musicOn.value) {
    musicOn.value = false
    bgMusic.pause()
  }
  else {
    musicOn.value = true
    bgMusic.play()
  }
}
</script>

<template>
  <section>
    <div class="top">
      <div>
        <h1>{{ name }}</h1>
        <p>{{ daysOld }} days old</p>
      </div>
      <div class="actions">
        <button type="button" @click="eat">
          <img :src="cooldown || sleeping ? '/ui/eat-inactive.png' : '/ui/eat.png'" alt="eat" />
        </button>
        <button type="button" @click="pet">
          <img :src="cooldown || sleeping ? 'ui/flip-inactive.png' : '/ui/flip.png'" alt="flip" />
        </button>
        <button type="button" @click="rest">
          <img :src="sleeping ? '/ui/switch.png' : cooldown ? '/ui/switch-inactive.png' : '/ui/switch-on.png'" alt="Toggle sleep light" />
        </button>
      </div>
      <div class="music-toggle">
        <button type="button" @click="toggleMusic()">
          <img :src="musicOn ? '/ui/sound-on.png' : '/ui/sound-off.png'" alt="" />
        </button>
      </div>
    </div>

    <PopUp v-model="showModal" image="ui/egg.png">
      <h2>An egg! What will you name it?</h2>
      <input
        v-model="inputName"
        type="text"
        placeholder="Mibo"
      />
      <button
        class="input-button"
        @click="submitName"
      >
        OK
      </button>
    </PopUp>

    <PopUp v-model="showDeath" image="ui/skull.png">
      <h2>{{ name }} has passed away :c</h2>
      <button
        class="input-button"
        @click="restart"
      >
        Restart
      </button>
    </PopUp>

    <div class="bottom">
      <div class="stat-container">
        <div class="icon">
          <img :src="`/ui/${turtleImage}`" alt="turtle" />
        </div>
        <div class="stats">
          <div class="stat stat--fullness">
            <div :style="`height:${getHeight(stats.fullness)}`"></div>
            <img src="/ui/fullness.png" alt="fullness" />
          </div>
          <div class="stat stat--energy">
            <div :style="`height:${getHeight(stats.energy)}`"></div>
            <img src="/ui/energy.png" alt="energy" />
          </div>
          <div class="stat stat--happiness">
            <div :style="`height:${getHeight(stats.happiness)}`"></div>
            <img src="/ui/happiness.png" alt="happiness" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="css" scoped>
section .top {
  position: absolute;
  top: 0;
  padding: 0 20px;
  padding-top: 20px;
  width: 100%;
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  gap: 2px;
  align-items: center;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 4px;
  order: 3;

  @media (min-width: 633px) {
    gap: 20px;
    order: 0;
  }
}

.music-toggle {
  order: 0;
  width: 50px;

  @media (min-width: 400px) {
    width: 100px;
  }
}

.top button img {
  width: 100%;

  @media (min-width: 600px) {
    height: 100px;
    width: auto;
  }
}

section .bottom {
  background-color: #f0f6e8;
  bottom: 0%;
  position: absolute;
  width: 100%;
  padding: 20px;
}

.stat-container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 4px;

  @media (min-width: 600px) {
    gap: 20px;
  }
}

.icon {
  display: none;

  @media (min-width: 600px) {
    display: inline-block;
    width: 165px;
  }
}

.icon img {
  width: 100%;
}

.stats {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2px;

  @media (min-width: 600px) {
    gap: 20px;
  }
}

.stat {
  position: relative;
  width: 100px;
  height: 120px;
}

.stat img {
  position: absolute;
  width: 100%;
}

.stat div {
  position: absolute;
  width: 100%;
  bottom: 10px;
}

.stat--fullness div {
  background-color: #93d4b5;
}

.stat--energy div {
  background-color: #87a2dc;
}

.stat--happiness div {
  background-color: #e39aac;
}
</style>
