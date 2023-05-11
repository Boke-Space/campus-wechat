<template>
  <view class="tab_nav">
    <view class="navTitle" v-for="(item) in navList" :key="item.index">
      <view :class="{ active: isActive === item.index }" @click="onChange(item.index)">
        {{ item.title }}
      </view>
    </view>
  </view>

  <template class="nav_item" v-if="isActive == 7"><Note /></template>
  <template class="nav_item" v-if="isActive == 8"><Notice /></template>
</template>

<script setup lang="ts">
import Note from '../components/Forum/Note.vue'
import Notice from '../components/Forum/Notice.vue'

let isActive = $ref(7)
let navList = $ref([
  {
    index: 7,
    title: '论坛',
  },
  {
    index: 8,
    title: '通知',
  },

])

const onChange = (index) => (isActive = index)
</script>

<style scoped lang="less">
:deep(.van-cell-group) {
  margin: 10px;
}

.tab_nav {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.tab_nav .navTitle {
  height: 90rpx;
  line-height: 90rpx;
  width: 100%;
  text-align: center;
  font-size: 32rpx;
  font-family: Alibaba PuHuiTi;
  color: #333;
}
.active {
  position: relative;
  color: #1f75fe;
}
.active::after {
  content: '';
  position: absolute;
  width: 100rpx;
  height: 4rpx;
  background-color: #1f75fe;
  left: 0px;
  right: 0px;
  bottom: 0px;
  margin: auto;
}

:deep(.van-swipe-cell__right) {
  display: inline-block;
  font-size: 15px;
  color: #fff;
  text-align: center;
  background-color: #f44;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
</style>
