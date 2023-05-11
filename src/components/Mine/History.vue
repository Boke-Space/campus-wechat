<template>
  <view class="Index">
    <view class="pubuBox">
      <view class="pubuItem">
        <view
          class="item-masonry"
          v-for="(item, index) of historyList"
          :key="index"
        >
          <image :src="item.urlList[0]" mode="widthFix" @click="gotoDetail(item)"></image>
          <view class="listtitle">
            <!-- 这是没有高度的父盒子（下半部分） -->
            <view class="listtitle1">{{ item.title }}</view>
            <view style="display:flex;margin-top: 8px;position:relative">             
              <van-image round lazy-load width="2rem" height="2rem" :src="item.avatarUrl" />
              <view class="username">{{ item.username }}</view>
              <view style="margin-left:32px;margin-top: 8px;">
                <van-icon style="position:absolute; right: 10px; bottom: 4px" name="delete-o" size="24px" @click="handleDelete(item.id)" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
let historyList = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []

onMounted(() => {
  historyList = uni.getStorageSync('browseHistory') || []
  historyList.map((item: any) => promiseList.push(findUser({ username: item.username })))
  Promise.all(promiseList).then((res: any) => {
      res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
      historyList.forEach(item => {
          avatarUrlList.map(subItem => {
              item.avatarUrl = subItem
          })
      })
  })
})
const gotoDetail = (item: any) => uni.navigateTo({ url: '../Comment?item=' + JSON.stringify(item)})

const handleDelete = (id) => {
  const browseHistory = uni.getStorageSync('browseHistory') || []
  let index = browseHistory.findIndex(data => data.id == id)
  browseHistory.splice(index, 1)
  historyList = browseHistory
  uni.setStorageSync('browseHistory', (browseHistory))
}
</script>

<style scoped lang="less">
page {
  background-color: #eee;
  height: 100%;
}

.pubuBox {
  padding: 22rpx;
}

.pubuItem {
  column-count: 2;
  column-gap: 20rpx;
}

.item-masonry {
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background-color: #fff;
  break-inside: avoid;
  /*避免在元素内部插入分页符*/
  box-sizing: border-box;
  margin-bottom: 20rpx;
  box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
}

.item-masonry image {
  width: 100%;
}

.listtitle {
  padding-left: 22rpx;
  font-size: 24rpx;
  padding-bottom: 22rpx;

  .listtitle1 {
    line-height: 39rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 39rpx;
    max-height: 78rpx;
  }

  .listtitle2 {
    color: #ff0000;
    font-size: 32rpx;
    line-height: 32rpx;
    font-weight: bold;
    padding-top: 22rpx;

    .listtitle2son {
      font-size: 32rpx;
    }
  }

  .listtitle3 {
    font-size: 28rpx;
    color: #909399;
    line-height: 32rpx;
    padding-top: 22rpx;
  }
}

.Index {
  width: 100%;
  height: 100%;
}

.username {
  margin-left: 8px;
  margin-top: 8px;
}
</style>
