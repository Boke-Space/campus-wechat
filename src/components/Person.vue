<template>
    <div>
        <view class="header">
          <van-image round lazy-load width="5rem" height="5rem" :src="userInfo.avatarUrl"  />
            <view class="username">
                <view>{{ userInfo.username }}</view>
                <view>{{ userInfo.job }}</view>
            </view>
        </view>
        <view style="margin-left:36px;margin-top: 16px;display:flex">
            <view>
                <view style="margin-left: 10px;">{{ likeNum }}</view>
                <view>关注</view>
            </view>
            <view style="margin-left: 32px;">
                <view style="margin-left: 10px;">{{ fansNum }}</view>
                <view>粉丝</view>
            </view>
            <view v-if="userInfo.username !== name"  style="margin-top: 8px;position:absolute;right:64px;">
                <span v-if="isLike" @click="handleLike(false)">取消关注</span>
                <span v-else @click="handleLike(true)">关注</span>
            </view>
            <view v-if="userInfo.username !== name"  style="margin-top: 4px;position:absolute;right:16px;">
                <van-icon name="chat-o" size="30px" @click="gotoChat" />
            </view>
        </view>

        <view class="Index">
          <view class="pubuBox">
            <view class="pubuItem">
              <view
                class="item-masonry"
                v-for="(item, index) of noticeList"
                :key="index"
              >
                <image :src="item.urlList[0]" mode="widthFix" @click="gotoDetail(item)"></image>
                <view class="listtitle">
                  <!-- 这是没有高度的父盒子（下半部分） -->
                  <view class="listtitle1">{{ item.title }}</view>
                  <view style="display:flex;margin-top: 8px;">             
                    <van-image round lazy-load width="2rem" height="2rem" :src="userInfo.avatarUrl" />
                    <view class="name">{{ item.username }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
    </div>

</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import { getNotice } from '@/api/comment'

const { user } = $(useLogin())
let userInfo = $ref<any>({})
let likeList = $ref<any>()
let fansNum = $ref(0)
let likeNum = $ref(0)
let noticeList = $ref<any>([])
let browseHistory = $ref<any[]>([])
const isLike = computed(() => likeList?.includes(userInfo.username))
let username = $ref('')
const name = uni.getStorageSync('username')

onLoad(async (item) => {
  username = item.username as string
  await getList()
})

const getList = async () => {
  findUser({ username }).then(async res => {
    userInfo = res.data.list[0]
    likeNum = res.data.list[0].likeList.length
    fansNum = res.data.fansList.length
    const { data: { list } } = await getNotice({ username: userInfo.username})
    noticeList = list
  })
  const { data: { list  } } = await findUser({ username: name })
  likeList = list[0].likeList
}

const handleLike = async (flag: boolean) => {
  await user.modifyUser(flag, userInfo.username)
  getList()
}

const gotoChat = () => uni.navigateTo({ url: `../components/Chat/ChatDetail?recipient=${userInfo.username}`})

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

</script>

<style scoped lang="less">
.header {
  display: flex;
  margin-left: 24px;
  margin-top: 16px;

  .username {
    margin-left: 16px;
    font-size: 20px;
    margin-top: 8px;
  }
}

:deep(.van-cell-group) {
  margin: 10px;
}

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
    font-size: 15px;
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
    margin-top: 4px;
  }
}

.Index {
  width: 100%;
  height: 100%;
}

.name {
  margin-left: 8px;
  margin-top: 8px;
}
</style>