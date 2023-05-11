<template>
    <view style="background-color: #f7f8fa;border-radius: 16px;margin-left: 16px;margin-right: 16px;">
      <div class="header">
        <div class="username">
          <div style="display: flex;">
            <van-image round lazy-load width="4rem" height="4rem" :src="userInfo.avatarUrl"  />
            <div style="margin-left: 16px;margin-top: 8px;">
              <div>{{ userInfo.username }}</div>
              <div style="font-size: 16px;">{{ userInfo.job }}</div>
            </div>
          </div>
          <van-icon name="user-circle-o" size="32px" @click="gotoPassword" />
          <van-icon name="setting-o" size="32px" @click="gotoUser" />
          <van-icon style="margin-right: 16px;" name="warning-o" size="32px" @click="show = true" />
        </div>
      </div>

      <view style="margin-left:16px;margin-top: 16px;margin-bottom: 16px;display:flex;padding-bottom: 20px;">
        <view @click="gotoLike()">
          <view style="margin-left: 10px;">{{ likeList }}</view>
          <view>关注</view>
        </view>
        <view style="margin-left: 32px;" @click="gotoFriend()">
          <view style="margin-left: 10px;">{{ fansList }}</view>
          <view>粉丝</view>
        </view>
        <view style="margin-left: 32px;" @click="gotoCollect">
          <view style="margin-left: 10px;">{{ collectNum }}</view>
          <view>收藏</view>
        </view>
        <view style="margin-left: 32px;" @click="gotoHistory">
          <view style="margin-left: 10px;">{{ historyNum }}</view>
          <view>历史</view>
        </view>
        <view style="margin-left: 32px;" @click="gotoNote">
          <view style="margin-left: 10px;">{{ articleNum }}</view>
          <view>帖子</view>
        </view>
        <view style="margin-left: 32px;" @click="gotoCar">
          <view style="margin-left: 10px;">{{ carNum }}</view>
          <view>想要</view>
        </view>
      </view>
      
    </view>

    <view style="background-color: #f7f8fa;border-radius: 16px;margin-left: 16px;margin-right: 16px;">
      <view class="flex" style="padding-top: 16px;">
        <img style="margin-left: 8px;" class="icon" src="../static/message.png" />
        <view style="margin-left: 8px;font-size: 18px;">消息提醒</view>
      </view>
      <view style="display: flex;justify-content: space-between;flex-wrap: wrap;margin-top: 8px;">
        <view style="margin-left:8px;background-color:#f7f8fa;position:relative;height:120px;flex:1;border-radius: 16px;" @click="messageCollect">
          <img class="message" src="../static/star.png" />
          <view class="notice" v-if="collectionNum > 0">{{ collectionNum }}</view>
          <view class="content">收藏我的</view>
        </view>
        <view style="margin-left:8px;background-color:#f7f8fa;position:relative;height:120px;flex:1;border-radius: 16px;" @click="messageLike">
          <img class="message" src="../static/like.png" />
          <view class="notice" v-if="likeNum > 0">{{ likeNum }}</view>
          <view class="content">收到的赞</view>
        </view>
        <view style="margin-left:8px;margin-right:8px;background-color:#f7f8fa;position:relative;height:120px;flex:1;border-radius: 16px;" @click="messageAttention">
          <img class="message" src="../static/contact.png" />
          <view class="notice" v-if="attentionNum > 0">{{ attentionNum }}</view>
          <view class="content">新增关注</view>
        </view>
      </view>
      
    </view>
    
    <van-cell-group inset>
      <van-cell
        title="最近联系"
        @click="gotoChat"
        is-link
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        title="教室申请"
        @click="gotoApply"
        is-link
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        title="失物招领"
        @click="gotoLost"
        is-link
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        title="二手买卖"
        @click="gotoSell"
        is-link
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        title="快递代拿"
        @click="gotoExpress"
        is-link
      />
    </van-cell-group>

    <van-dialog
      :show="show"
      width="270px"
      message="你确定要退出登录吗"
      @close="show=false"
      @confirm="handleLogOut"
      showConfirmButton
      show-cancel-button>
  </van-dialog>
</template>

<script setup lang="ts">
import { onShow, onLoad } from '@dcloudio/uni-app';

const { username } = $(useLogin())
let userInfo = $ref<any>({})
let likeList = $ref<any>()
let fansList = $ref<any>()

let collectionNum = $ref(0)
let likeNum = $ref(0)
let attentionNum = $ref(0)
let articleNum = $ref(0)
let carNum = $ref(0)
let show = $ref(false)
let collectNum = $ref(0)
let historyNum = $ref(0)

const messageCollect = () => uni.navigateTo({ url: `/components/Chat/StarMessage` })
const messageLike = () => uni.navigateTo({ url: `/components/Chat/LikeMessage` })
const messageAttention= () => uni.navigateTo({ url: `/components/Chat/AttentionMessage` })

const gotoChat = () => uni.navigateTo({ url: '/components/Mine/Chat'})
const gotoHistory = () => uni.navigateTo({ url: '/components/Mine/History'})
const gotoNote = () => uni.navigateTo({ url: '/components/Mine/Note'})
const gotoCollect = () => uni.navigateTo({ url: '/components/Mine/Collect'})
const gotoApply = () => uni.navigateTo({ url: '/components/Mine/Apply' })
const gotoLike = () => uni.navigateTo({ url: '/components/Mine/Like' })
const gotoFriend = () => uni.navigateTo({ url: '/components/Mine/Friend' })
const gotoLost = () => uni.navigateTo({ url: '/components/Mine/Lost' })
const gotoSell = () => uni.navigateTo({ url: '/components/Mine/Sell' })
const gotoCar = () => uni.navigateTo({ url: '/components/Mine/Car' })
const gotoExpress = () => uni.navigateTo({ url: '/components/Mine/Express' })
const gotoUser = () => uni.navigateTo({ url: `/components/Mine/UserInfo?item=${JSON.stringify(userInfo)}` })
const gotoPassword = () => uni.navigateTo({ url: `/components/Mine/Password?item=${JSON.stringify(userInfo)}` })

const handleLogOut = () => {
  uni.clearStorageSync()
  uni.navigateTo({ url: '../pages/Login' })
}

onShow(async () => {
  let { data: { total: collectList } } = await getMessageApi({ recipient: username, type: '1', isRead: '0' })
  collectionNum = collectList
  let { data: { total } } = await getMessageApi({ recipient: username, type: '2', isRead: '0' })
  likeNum = total
  let { data: { total: attentionList } } = await getMessageApi({ recipient: username, type: '3', isRead: '0' })
  attentionNum = attentionList
  const { data: { total: article } } = await getNotice({ username: username })
  articleNum = article
  carNum = uni.getStorageSync('sellList').length
  let { data } = await findUser({ username: uni.getStorageSync('username') })
  userInfo = data.list[0]
  likeList = data.list[0].likeList.length
  fansList = data.fansList.length
  collectNum = data.list[0].collectList.length
  historyNum = uni.getStorageSync('browseHistory').length
  uni.setStorageSync('username', data.list[0].username)
  uni.setStorageSync('collectList', data.list[0].collectList)
  uni.setStorageSync('likeList', data.list[0].likeList)
  uni.setStorageSync('fansList', data.fansList)
})

onMounted(async () => {
  let { data: { total: collectList } } = await getMessageApi({ recipient: username, type: '1', isRead: '0' })
  collectionNum = collectList
  let { data: { total } } = await getMessageApi({ recipient: username, type: '2', isRead: '0' })
  likeNum = total
  let { data: { total: attentionList } } = await getMessageApi({ recipient: username, type: '3', isRead: '0' })
  attentionNum = attentionList
  const { data: { total: article } } = await getNotice({ username: username })
  articleNum = article
  carNum = uni.getStorageSync('sellList').length
  let { data } = await findUser({ username: uni.getStorageSync('username') })
  userInfo = data.list[0]
  likeList = data.list[0].likeList.length
  fansList = data.fansList.length
  collectNum = data.list[0].collectList.length
  historyNum = uni.getStorageSync('browseHistory').length
  uni.setStorageSync('username', data.list[0].username)
  uni.setStorageSync('collectList', data.list[0].collectList)
  uni.setStorageSync('likeList', data.list[0].likeList)
  uni.setStorageSync('fansList', data.fansList)
})
</script>

<style scoped="scoped" lang="less">
:deep(.van-cell-group) {
  margin: 16px;
}

.header {
  display: flex;
  margin-top: 16px;

  .username {
    margin-left: 16px;
    font-size: 20px;
    margin-top: 8px;
    display: flex;
    width: 100vw;
    justify-content: space-between;
  }
}

// .left {
//   position: absolute;
//   right: 64px;
//   top: 36px;
// }

// .image {
//   position: absolute;
//   left: 32px;
//   top: 16px;
// }

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}


.icon {
  width: 32px;
  height: 32px;
}

.notice {
    width:20px;
    height:20px;
    line-height:20px;
    font-size:10px;
    color:#fff;
    text-align:center;
    background-color:#f00;
    border-radius:50%;
    position:absolute;
    right:10px;
    top:10px;
}

.content {
  position: absolute;
  position: absolute;
  left: 50%;
  top: 72px;
  transform: translateX(-50%);
  font-size: 14px;
}

.flex {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.message {
  width: 52px;
  height: 52px;
  position: absolute;
  left: 50%;
  top: 16px;
  transform: translateX(-50%)
}
</style>
