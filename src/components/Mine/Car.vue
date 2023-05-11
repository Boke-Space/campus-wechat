<template>
    <view v-for="(item, index) of historyList" :key="index" style="margin-bottom: 8px;">
        <van-swipe-cell right-width="55">
            <van-card
                :price="item.price"
                :desc="item.content"
                :title="item.title"
                :thumb="item.urlList[0]"
                :thumb-link="`/components/Discover/SellDetail?item=${JSON.stringify(item)}`"
            />
            <view slot="right" @click="handleDelete(item.id)">删除物品</view>
        </van-swipe-cell>
    </view>
    <!-- <view class="Index">
        <view class="pubuBox">
            <view class="pubuItem">
                <view class="item-masonry" v-for="(item, index) of historyList" :key="index">
                    <image :src="item.urlList[0]" mode="widthFix" @click="gotoDetail(item)"></image>
                    <view class="listtitle">
                        <view class="listtitle1">{{ item.title }}</view>
                        <view style="display:flex;margin-top: 8px;position:relative">
                            <van-image round lazy-load width="2rem" height="2rem" :src="item.avatarUrl" />
                            <view class="username">{{ item.username }}</view>
                            <view style="margin-left:32px;margin-top: 8px;">
                                <van-icon style="position:absolute; right: 10px; bottom: 4px" name="delete-o" size="24px"
                                    @click="handleDelete(item.id)" />
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view> -->
</template>
  
<script setup lang="ts">
let historyList = $ref<any[]>([])

onMounted(() => {
    historyList = uni.getStorageSync('sellList')
})

const handleDelete = (id) => {
    const browseHistory = uni.getStorageSync('sellList') || []
    let index = browseHistory.findIndex(data => data.id == id)
    browseHistory.splice(index, 1)
    historyList = browseHistory
    uni.setStorageSync('sellList', historyList)
}
</script>
  
<style scoped lang="less">
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
  