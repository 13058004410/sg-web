<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { computed, onMounted, ref, withDefaults } from 'vue'

interface Props {
  condition?: 'below' | 'above'
  target?: number
  result: number
}

const props = withDefaults(defineProps<Props>(), {
  condition: 'above',
  target: 1,
})
const historyCanvas: any = ref(null)
let canvasWidth: any
let canvasHeight: any
let app: any

const isAbove = computed(() => props.condition === 'above')
const isWin = computed(() => {
  if (isAbove.value)
    return props.result > props.target
  else
    return props.result < props.target
})

const redColor = isAbove.value ? 0xE9103D : 0x00E700
const greenColor = isAbove.value ? 0x00E700 : 0xE9103D
const diceTextStyle = isWin.value
  ? new PIXI.TextStyle({
    fontSize: '15px',
    fontWeight: '600',
    fill: '#00B804',
    dropShadowColor: '#FFFFFF',
    dropShadow: true,
    dropShadowDistance: 1,
  })
  : new PIXI.TextStyle({
    fontSize: '15px',
    fontWeight: '600',
    fill: '#E9103D',
    dropShadowColor: '#FFFFFF',
    dropShadow: true,
    dropShadowDistance: 1,
  })
const dicePosition = 21 + 426 * props.result / 100
const sliderPosition = 25 + 393 * props.target / 96

onMounted(() => {
  if (historyCanvas.value) {
    const element = historyCanvas.value
    canvasWidth = element.offsetWidth
    canvasHeight = element.offsetHeight

    app = new PIXI.Application({
      backgroundAlpha: 0,
      resizeTo: element,
      width: canvasWidth,
      height: canvasHeight,
      antialias: true,
      resolution: 2,
      autoDensity: true,
    })

    element.appendChild(app.view)

    drawDiceResult()
  }
})

function drawDiceResult() {
  const baseLine = new PIXI.Graphics()
  baseLine.beginFill(0x2F4553)
  baseLine.drawRoundedRect(0, 56, 468, 50, 25)
  baseLine.endFill()
  baseLine.beginFill(0x0F212E)
  baseLine.drawRoundedRect(10, 66, 448, 30, 15)
  baseLine.endFill()
  for (let i = 0; i < 5; i++) {
    baseLine.beginFill(0x2F4553)
    baseLine.moveTo(19 + 104.5 * i, 56)
    baseLine.lineTo(25 + 104.5 * i, 50)
    baseLine.lineTo(31 + 104.5 * i, 56)
    baseLine.lineTo(19, 56)
    baseLine.closePath()
    baseLine.endFill()
  }
  app.stage.addChild(baseLine)

  //  the numbers
  for (let i = 0; i < 5; i++) {
    const textN = new PIXI.Text(25 * i, new PIXI.TextStyle({ fontSize: '14px', fontWeight: '600', fill: '#B1BAD3' }))
    textN.anchor.set(0.5, 1)
    textN.position.set(25 + 104.5 * i, 50)
    app.stage.addChild(textN)
  }

  //  the slider bar
  const sliderBar = new PIXI.Graphics()
  sliderBar.beginFill(redColor)
  sliderBar.drawRoundedRect(21, 77, sliderPosition, 8, 4)
  sliderBar.endFill()
  sliderBar.beginFill(greenColor)
  sliderBar.drawRoundedRect(sliderPosition, 77, 448 - sliderPosition, 8, 4)
  sliderBar.endFill()
  app.stage.addChild(sliderBar)

  //  the slider
  const slider = PIXI.Sprite.from('/img/slider.svg')
  slider.eventMode = 'static'
  slider.cursor = 'not-allowed'
  slider.anchor.set(0.5)
  slider.position.set(sliderPosition, 81)
  slider.scale.set(0.8)
  app.stage.addChild(slider)

  //  the Dice
  const dice = PIXI.Sprite.from('/img/games.svg')
  dice.anchor.set(0.5, 1)
  dice.position.set(dicePosition, 81)
  app.stage.addChild(dice)
  const diceText = new PIXI.Text(props.result, diceTextStyle)
  diceText.anchor.set(0.45, 0.6)
  diceText.position.set(dicePosition, 81 - dice.height / 2)
  app.stage.addChild(diceText)
  console.log('the position of the text', diceText.position.x)

  // Dice animation
  const diceTicker = PIXI.Ticker.shared
  diceTicker.add(scaleUp)
  let count = 0
  function scaleUp(delta: any) {
    count += delta * 0.06
    dice.scale.set(0.9 + 0.1 * Math.sin(count))
    diceText.position.set(dicePosition, 81 - dice.height / 2)
    if (count >= 3.14)
      diceTicker.remove(scaleUp)
  }

  app.stage.scale.set(0.63 * canvasWidth / 297, 0.7 * canvasWidth / 297)
  app.stage.position.y = canvasHeight * 0.15 * canvasWidth / 297
}
</script>

<template>
  <div id="history-canvas" ref="historyCanvas" />
</template>

<style lang="scss" scoped>
#history-canvas {
    width: 100%;
    height: 162px;
}
</style>
