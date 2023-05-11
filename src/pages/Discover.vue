<template>
    <view class="tab_nav">
        <view class="navTitle" v-for="(item) in navList" :key="item.index">
            <view :class="{ active: isActive === item.index }" @click="onChange(item.index)">
                {{ item.title }}
            </view>
        </view>
    </view>

    <template class="nav_item" v-if="isActive == 1">
        <Lost />
    </template>
    <template class="nav_item" v-if="isActive == 2">
        <Sell />
    </template>
    <template class="nav_item" v-if="isActive == 3">
        <Express />
    </template>
</template>
  
<script setup lang="ts">
import Lost from '../components/Discover/Lost.vue'
import Sell from '../components/Discover/Sell.vue'
import Express from '../components/Discover/Express.vue'

let isActive = $ref(1)
let navList = $ref([
    {
        index: 1,
        title: '失物招领',
    },
    {
        index: 2,
        title: '二手买卖',
    },
    {
        index: 3,
        title: '快递代拿',
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
}</style>
  