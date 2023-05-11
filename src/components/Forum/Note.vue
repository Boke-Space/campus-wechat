<template>
  <view v-for="(item, index) of noticeList" :key="index">
    <view>
        <view style="display:flex;margin-top: 8px;margin-left: 16px;position:relative" @click="gotoDetail(item)">             
            <van-image round lazy-load width="3rem" height="3rem" :src="item.avatarUrl"  @click="gotoPerson(item.username)"  />
            <view class="username">
                <view>{{ item.username }}</view>
                <view>{{ item.createTime }}</view>
            </view>
        </view>
        <view style="margin-top: 8px;margin-bottom: 8px;margin-left: 16px;position:relative">
            <view v-if="item.title">{{ item.title }}</view>
        </view>
        <view style="display: flex;">
            <view class="imageInfo" v-for="(image, index) of item.urlList">
                <image :src="image" :tabindex="index" aspectFill @click="previewImg" />
            </view>
        </view>
    </view>
    <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
    <Move>
      <image style="width:60px;height:60px" src="../../static/add.png" mode="widthFix" @click="handleMove" />
    </Move>
  </view>
</template>

<script setup lang="ts">
import { getNotice } from '@/api/comment'
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import Move from "@/components/Move.vue";

let noticeList = $ref<any>([])
let browseHistory = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
let urlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []
let current = $ref(1)
let size = $ref(5)
let count = $ref(0)
let isLoading = $ref(false)

onShow(() => getList())
onMounted(() => getList())

const getList = async (params = {}) => {
  const { data: { list, total } } = await getNotice(params)
  if (noticeList.length !== list.length) {
    noticeList = [ ...noticeList, ...list ]
    count = total
  } 
  count = total
  urlList = list.map(item => item.urlList)[0]
  noticeList.map(async item => {
    const { data: { list } } = await getLikeList({ foreignId: item.id })
    item.likeNum = list.map(item => (item.likeList.length)).reduce((prev, current) => prev + current, 0)
  })
  list.map((item: any) => promiseList.push(findUser({ username: item.username })))
  Promise.all(promiseList).then((res: any) => {
    res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
    noticeList.forEach((item, index) => {
        item.avatarUrl = avatarUrlList[index]
    })
  })
}

const previewImg = (e) => {
    let index = e.currentTarget.dataset.index
    uni.previewImage({
        current: urlList[index],
        urls: urlList,
    })
}

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

const gotoDetail = (item) => {
  uni.navigateTo({ url: `../components/Comment?item=${JSON.stringify(item)}`  })
  browseHistory = uni.getStorageSync('browseHistory') || []
  let index = browseHistory.findIndex(data => data.id == item.id)
  if (index !== -1) {
    browseHistory.splice(index, 1)
    browseHistory.unshift(item)
    uni.setStorageSync('browseHistory', [ ...new Set(browseHistory) ])
  } else {
    browseHistory.unshift(item)
    uni.setStorageSync('browseHistory', [ ...new Set(browseHistory) ])
  }
}

const gotoPerson = (username) => uni.navigateTo({ url: `../components/Person?username=${username}` })

const handleMove = () => uni.navigateTo({ url: `/components/Forum/NoteAppend` })
</script>

<style scoped lang="less">
:deep(.van-cell-group) {
  margin: 10px;
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
