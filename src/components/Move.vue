<template>
  <movable-area class="movableArea">
    <movable-view class="movableView" direction="all" x="600rpx" y="360rpx">
      <slot></slot>
	  </movable-view>
  </movable-area>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.movableArea {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; //设置area元素不可点击，则事件便会下移至页面下层元素
  .movableView {
    pointer-events: auto; //可以点击
    width: 120rpx;
    height: 110rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
