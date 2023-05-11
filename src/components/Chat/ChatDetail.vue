<template>
    <div>
      <view class="title">{{ recipient }}</view>
      <view class="chat">
        <template v-for="(item, index) of historyList" :key="index">
          <div v-if="item.recipient == recipient && item.sender == username" style="text-align: right"> 
            <div>{{item.createTime}}</div>
            <div style="position:relative">
              <span class="message-right">{{item.message}}</span>
              <van-image round lazy-load width="4rem" height="4rem" :src="userInfo.avatarUrl" />  
            </div>
          </div>
          <div v-if="item.recipient == username && item.sender == recipient">
            <div>{{item.createTime}}</div>
            <div style="position:relative">
              <span class="message-left">{{item.message}}</span>
              <van-image round lazy-load width="4rem" height="4rem" :src="recipientInfo.avatarUrl" />  
            </div>
          </div>
        </template>
      </view>
      <van-cell-group inset>
        <view style="display: flex; background-color: #fff; padding: 10px">
          <span style="color: #000000; margin-right: 32px">内容</span>
          <input type="text" style="flex: 1" v-model="message" />
          <van-button slot="button" size="small" type="info" round @click="send">发送</van-button>
        </view>
      </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { dateToSecond } from '@/utils/time';
import { baseURL } from "@/api/request";

const { username } = $(useLogin())

let recipient = $ref('')
let message = $ref('')
let recipientInfo = $ref<any>({})
let userInfo = $ref<any>({})
let historyList = $ref<any>([])

const send = (e) => {
  if (message == '') uni.showToast({ icon: 'none', title: '请输入评论内容' })
  else {
    uni.sendSocketMessage({
      data: JSON.stringify({ 
        username,
        to: recipient,
        message
      })
    })
    historyList.push({
      sender: username,
      createTime: dateToSecond(new Date),
      recipient,
      message,
    })
    message = ''
    }
}

onLoad(async (item: any) => {
  recipient = item.recipient
  const { data: { list: recipientData } } = await findUser({ username: recipient })
  recipientInfo =  recipientData[0]
  const { data: { list: userData } } = await findUser({ username })
  userInfo =  userData[0]
  let { data: { list: senderList } } = await getChatList({ sender: username, recipient })
  let { data: { list: recipientList } } = await getChatList({ sender: recipient, recipient: username })
  senderList = senderList
  recipientList = recipientList
  historyList = [ ...senderList, ...recipientList ]
  historyList.sort((prev: any, next: any) => prev.createTime.localeCompare(next.createTime) || prev.createTime.localeCompare(next.createTime))
  uni.connectSocket({ url: `ws://${baseURL}/websocket/${username}` })
  // uni.onSocketOpen(()=> console.log(`${username}上线`))
  // uni.onSocketError(()=> console.log(`WebSocket连接打开失败，请检查！`))
  uni.onSocketMessage(({ data }: any) => {
    const item = JSON.parse(data)
    if(item) {
      let { message, recipient, sender } = item
      if (recipient !== undefined && sender !== undefined) {
        historyList.push({
          createTime: dateToSecond(new Date),
          message, 
          recipient,
          sender
        })
      }
      recipient = item.sender
    }
  })
})

// onUnload(() => {
//   // uni.closeSocket({})
//   uni.onSocketClose(() => console.log('WebSocket 已关闭！'));
// })
</script>


<style scoped>
.title {
  display: flex;
  justify-content: center;
  margin-top: 16px;
  font-size: 18px;
}

.chat {
  height: 85vh;
  overflow-y: auto;
}

.message-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 80px;
}

.message-left {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 80px;
}
</style>