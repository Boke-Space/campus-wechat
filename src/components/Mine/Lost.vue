<template>
  <view v-for="(item, index) of lostList" :key="index">
      <view style="border-radius: 16px;background-color: #f7f8fa;margin: 10px">
          <view style="display:flex;margin-top: 8px;margin-left: 16px;position:relative" @click="gotoDetail(item)">             
              <van-image round lazy-load width="3rem" height="3rem" :src="avatarUrl" />
              <view class="username">
                  <view>{{ item.username }}</view>
                  <view>{{ item.createTime }}</view>
              </view>
              <van-tag v-if="item.isLost == 0" round type="primary" style="position:absolute;right:16px;top:8px" size="large">捡到物品</van-tag>
                <van-tag v-if="item.isLost == 1" round type="danger" style="position:absolute;right:16px;top:8px" size="large">丢失物品</van-tag>
          </view>
          <view style="margin-top: 8px;margin-bottom: 8px;margin-left: 16px;position:relative;padding-bottom: 16px;margin-bottom: 16px;">
            <view v-if="item.isLost == 0">
              <view v-if="item.title">捡到物品：{{ item.title }}</view>
              <view v-if="item.address">捡到地点：{{ item.address }}</view>
              <view v-if="item.time">捡到时间：{{ item.time }}</view>
            </view>
              <view v-if="item.isLost == 1">
                <view v-if="item.title">丢失物品：{{ item.title }}</view>
                <view v-if="item.address">丢失地点：{{ item.address }}</view>
              <view v-if="item.time">丢失时间：{{ item.time }}</view>
            </view>
            <van-icon style="position:absolute; right: 10px; bottom: 12px" name="delete-o" size="24px" @click="handleDelete(item.id)"/>
            <van-icon style="position:absolute; right: 40px; bottom: 12px" name="notes-o" size="24px" @click="handleModify(item)" />
          </view>
      </view> 
  </view>
  <Move>
    <image style="width:60px;height:60px" src="../../static/add.png" mode="widthFix" @click="handleMove" />
  </Move>
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import Move from "@/components/Move.vue";

const { username, avatarUrl } = $(useLogin())
let lostList = $ref<any[]>([])
let current = $ref(1)
let size = $ref(4)
let count = $ref(0)
let isLoading = $ref(false)

const getList = async (params: any = {}) => {
  const { data: { list, total } } = await getArticleApi({ type: 1, username, ...params })
  lostList = list
  count = total
}

onShow(() => getList())

onPullDownRefresh(async () => {
if (current * size >= count) {
  uni.hideNavigationBarLoading()
  uni.showToast({ title: '暂无更多数据', icon: 'none'})
} else {
  current++
  getList({current, size})
  uni.showToast({ title: '加载中', icon: 'none'})
}
setInterval(() => uni.stopPullDownRefresh(), 100)
})

onReachBottom(async () => {
if (current * size >= count) {
  isLoading = false
  uni.hideNavigationBarLoading()
  uni.showToast({ title: '暂无更多数据', icon: 'none'})
} else {
  isLoading = true
  current++
  getList({current, size})
  uni.showToast({ title: '加载中', icon: 'none'})
  isLoading = false
}
})

const previewImg = (e) => {
  let index = e.currentTarget.dataset.index
  uni.previewImage({
      current: urlList[index],
      urls: urlList,
  })
}

const gotoDetail = (item) => uni.navigateTo({ url: `/components/Discover/LostDetail?item=${JSON.stringify(item)}` })

const handleMove = () => uni.navigateTo({ url: `/components/Home/LostAppend` })

const handleModify = (item: any) => uni.navigateTo({ url: '/components/Mine/ArticleEdit?type=1&item=' + JSON.stringify(item) })

const handleDelete = async (id: number) => {
  const { success } = await deleteArticleApi(id)
  if (success) uni.showToast({ icon: 'none', title: '删除成功' })
  else uni.showToast({ icon: 'none', title: '删除失败' })
  const { data: { list } } = await getArticleApi({ type: 1, username })
  lostList = list
}
</script>

<style scoped lang="less">
.username {
margin-left: 16px;
margin-top: 4px;
}

.imageInfo {
  border: 1rpx solid #ccc;
  border-radius: 2rpx;
  width: 30%;
  height: 80px;
  margin: 2rpx 6rpx;

  image {
      width: 100%;
      height: 100%;
  }
}

.imageHeight {
  height: 200px !important;
}
</style>