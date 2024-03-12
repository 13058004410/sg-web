<script setup lang="ts">
import gsap from 'gsap'

const drawOption = [
  { bg: '#254252', icon: 'uni-money-unknown' },
  { bg: '#48667C', icon: 'uni-money-not', size: 'text-[30px]' },
  { bg: '#254252', icon: 'uni-money-not2' },
  { bg: '#48667C', text: '1', icon: '' },
  { bg: '#254252', icon: 'uni-money-unknown' },
  { bg: '#48667C', text: '1000', icon: '' },
  { bg: '#254252', text: '50', icon: '' },
  { bg: '#48667C', icon: 'uni-money-coin' },
]
const rotate = 360 / drawOption.length
let rotateGsap: gsap.core.Tween

function startRotate() {
  if (rotateGsap) {
    rotateGsap.restart()
  }
  else {
    rotateGsap = gsap.to('.draw-content', {
      duration: 5,
      rotation: 360 * 10,
      yoyo: true,
      onComplete: () => {
        gsap.to('.select-box', {
          duration: 0,
          repeatDelay: 0.35,
          opacity: 1,
          repeat: 10,
          yoyo: true,
        })
        // gsap.to('.draw-content>:nth-child(1)', {
        //   duration: 0,
        //   repeatDelay: 0.35,
        //   borderTop: '4px solid #ffffff',
        //   repeat: 10,
        //   yoyo: true,
        // })
      },
    })
  }
}

onMounted(() => {
  gsap.to('.lamp', { duration: 0, repeatDelay: 0.35, rotation: rotate / 2, repeat: -1, yoyo: true })
})
</script>

<template>
  <div>
    <div class="relative m-auto h-234 w-234 overflow-hidden border-[1px] border-[#6793b4] rounded-[50%] border-solid bg-[#5A7B91]">
      <BaseImage class="lamp" url="/png/casino/flashing_light.png" />
      <!-- <img class="lamp absolute left-[50%] top-[50%] ml-[-50%] mt-[-50%] w-[100%]" src="https://static1.9f.com/img/d.68d00dd9.png" alt=""> -->
      <!-- <img class="absolute left-[50%] top-[50%] z-[1] w-[37%]" style="transform: translate(-50%,-53%);" src="https://static1.9f.com/img/draw.323c5195.png" alt=""> -->
      <div class="absolute left-[50%] top-[50%] z-[1] translate-x-[-50%] translate-y-[-53%]">
        <BaseIcon class="text-[97px]" name="uni-game-pointer" />
      </div>
      <div class="draw-content absolute left-[50%] top-[50%] ml-[-43%] mt-[-43%] h-[86%] w-[86%] overflow-hidden rounded-[50%]">
        <div
          v-for="item, index in drawOption" :key="index" class="sector-item absolute h-[100%] w-[100%] rounded-[50%]"
          :style="{ transform: `rotate(${rotate * index - rotate / 2}deg)`, background: `conic-gradient(${item.bg} ${rotate}deg, transparent 0)` }"
        >
          <div class="absolute left-[64.5%] top-[12.5%] translate-x-[-50%] translate-y-[-30%] rotate-[22.5deg]">
            <span v-if="item.text" class="text-tg-text-white text-[22px] font-500">{{ item.text }}</span>
            <BaseIcon v-else :class="item.size ?? 'text-[43px]'" :name="item.icon" />
          </div>
        </div>
        <div class="select-box absolute left-[50%] translate-x-[-50%] opacity-[0]">
          <BaseIcon class="text-[108px]" style="--tg-icon-color:#fff" name="uni-game-select" />
          <!-- <div class="absolute left-[50%] h-[50%] w-[4px] origin-bottom-left rotate-[-23deg] bg-white" style="transform: rotate(-22.5deg);" />
          <div class="absolute left-[50%] h-[50%] w-[4px] origin-bottom-right rotate-[21deg] bg-white" style="transform: rotate(22.5deg);" /> -->
        </div>
      </div>
      <div class="text-tg-text-white absolute left-[50%] top-[50%] z-[1] w-[37%] translate-x-[-50%] translate-y-[-50%] cursor-pointer text-center" @click="startRotate">
        <div class="font-500">
          <span class="text-[32px]">0</span>
          <span class="absolute top-[14px] pl-2 text-[14px]">次</span>
        </div>
        <div class="mt-4text-[14px] font-600">
          抽奖
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
