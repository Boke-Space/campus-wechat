<template>
  <view style="margin-bottom: 8px;">
    <view v-for="(item, index) of noticeList" :key="index">
    <van-swipe-cell right-width="55">
      <view style="display: flex;">
        <view style="margin-top: 8px;margin-left: 16px;flex:1" @click="gotoDetail(item)">             
          <view style="font-size: 18px;">{{ item.title }}</view>
          <view style="font-size: 16px;margin-top: 4px;display: -webkit-box;overflow: hidden;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{ item.content }}</view>
          <view style="display: flex;margin-top: 8px;font-size: 14px">
            <view>{{ item.createTime.slice(5) }}</view>
            <view style="margin-left: 16px">已读 {{item.readCount}} / 总数 {{userNum}}</view>
          </view>
        </view>
        <view class="imageInfo" v-for="(image, index) of item.urlList.slice(0, 1)">
          <image :src="image" :tabindex="index" aspectFill />
        </view>
    </view>
      <view v-if="item.isRead" slot="right" @click="handleSwiper(item, false)">标记未读</view>
      <view v-else="item.isRead" slot="right" @click="handleSwiper(item, true)">标记已读</view>
    </van-swipe-cell>
   
    <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
  </view>
  </view>

  <!-- <van-cell-group inset v-for="item of noticeList" :key="item.id">
    <van-swipe-cell right-width="55">
      <van-cell :label="item?.createTime" icon="bullhorn-o" is-link>
        <view slot="title" @click="gotoDetail(item)">
          <div class="van-cell-text" style="margin-right: 16px;">{{item.title}}</div>
          <div class="van-cell-text">
            <span>已读 {{item.readCount}} / </span>
            <span>总数 {{userNum}}</span>
          </div>
        </view>
      </van-cell>
      <view v-if="item.isRead" slot="right" @click="handleSwiper(item, false)">标记未读</view>
      <view v-else="item.isRead" slot="right" @click="handleSwiper(item, true)">标记已读</view>
    </van-swipe-cell>
  </van-cell-group> -->

  
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app';

const { username, department } = $(useLogin())

let noticeList = $ref<any>([])
let userNum = $ref<any>(0)
let current = $ref(1)
let size = $ref(10)
let count = $ref(0)
let isLoading = $ref(false)

const handleSwiper = async (item, flag) => {
  let { id, readCount, readList } = item
  if (flag == false) {
    let index = readList.findIndex(item => item === username)
    readList.splice(index, 1)
    readCount--
    const params = { id, readCount, readList }
    await modifyInformApi(params)
    getInformList()
  } else {
    readList.push(username)
    readCount++
    const params = { id, readCount, readList }
    await modifyInformApi(params)
    getInformList()
  }
}

const getInformList = async () => {
  const { data: { list, userCount } } = await getInformApi({ department })
  noticeList = list
  userNum = userCount
  noticeList.map((item) => {
    if (item.readList.length !== 0) {
      item.readCount = item.readList.length
      if (item.readList.includes(username)) {
        item.isRead = true
      }
    } else {
      item.readCount = 0
      item.isRead = false
    }
  })
}

// onPullDownRefresh(async () => {
//   if (current * size >= count) {
//     uni.hideNavigationBarLoading()
//     uni.showToast({ title: '暂无更多数据', icon: 'none'})
//   } else {
//     current++
//     getInformList({current, size})
//     uni.showToast({ title: '加载中', icon: 'none'})
//   }
//   setInterval(() => uni.stopPullDownRefresh(), 100)
// })

// onReachBottom(async () => {
//   if (current * size >= count) {
//     isLoading = false
//     uni.hideNavigationBarLoading()
//     uni.showToast({ title: '暂无更多数据', icon: 'none'})
//   } else {
//     isLoading = true
//     current++
//     getInformList({current, size})
//     uni.showToast({ title: '加载中', icon: 'none'})
//     isLoading = false
//   }
// })

const gotoDetail = (item) => uni.navigateTo({ url: `/components/Forum/NoticeDetail?item=${JSON.stringify(item)} `  })

onMounted(() => getInformList())
</script>

<style scoped lang="less">
.imageInfo {
    border: 1rpx solid #ccc;
    border-radius: 2rpx;
    width: 30%;
    height: 90px;
    margin-top: 12px;
    margin-right: 8px;

    image {
      width: 100%;
        height: 100%;
    }
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
