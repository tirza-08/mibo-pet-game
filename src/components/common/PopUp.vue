<script setup>
import { defineEmits, defineProps } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
})

const emits = defineEmits(['update:modelValue'])

function _close() {
  emits('update:modelValue', false)
}
</script>

<template>
  <div v-if="modelValue" class="modal__overlay">
    <div class="modal">
      <!-- <button class="modal__close" @click="close">✕</button> -->
      <img v-if="image" class="modal__image" :src="image" alt="image" />
      <slot></slot>
    </div>
  </div>
</template>

<style>
.modal__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #f0f6e8;
  border: 4px solid #e39aac;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal__close {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: transparent;
  font-size: 16px;
  cursor: pointer;
}

.modal__image {
  margin: 0 auto;
  width: 60px;
  display: block;
}
</style>
