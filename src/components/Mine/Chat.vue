<template>
    <view>
        <view>
            <view class="title">最近聊天</view>
            <view class="content">
                <van-cell-group inset v-for="(item, index) of recentUser" :key="index">
                    <view style="margin: 5px auto;" @click="choose(item)">
                        <van-cell>
                            <view slot="title" style="display: flex;">
                                <van-image round lazy-load width="4rem" height="4rem" :src="item.avatarUrl"/>
                                <view style="margin-left: 16px;margin-top: 8px;font-size: 16px;">
                                    <view >{{item.username}}</view>
                                    <view>{{item.message}}</view>
                                </view>
                            </view>
                        </van-cell>
                    </view>
                </van-cell-group>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getChatList } from '@/api/log';
import { onLoad, onShow } from '@dcloudio/uni-app';

let recipient = $ref('')
let recentUser = $ref<any[]>([])
let historyList = $ref<any>([])
let avatarUrlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []

const { username } = $(useLogin())

const choose = async (item: any) => {
    recipient = item.username
    uni.navigateTo({ url: `/components/Chat/ChatDetail?recipient=${recipient}` })
}

const getList = async () => {
    recentUser = []
    let { data: { list: senderList } } = await getChatList({ sender: username })
    let { data: { list: recipientList } } = await getChatList({ recipient: username })
    senderList = senderList
    recipientList = recipientList
    historyList = [ ...senderList, ...recipientList ]
    historyList.sort((prev: any, next: any) => prev.createTime.localeCompare(next.createTime) || prev.createTime.localeCompare(next.createTime)).reverse()
    
    historyList.map((item) => {
        let index = recentUser.find(subItem => subItem.recipient === item.recipient || subItem.recipient === item.sender)
        if (index == undefined && (recentUser.findIndex(subItem => subItem.username == item.recipient) == -1) && (recentUser.findIndex(subItem => subItem.username == item.sender) == -1) ) {
            if (item.recipient == username) recentUser.push({ username: item.sender, message: item.message })
            else recentUser.push({ username: item.recipient, message: item.message })
        }
    })
    
    recentUser.map((item: any) => promiseList.push(findUser({ username: item.username })))
    Promise.all(promiseList).then((res: any) => {
        res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
        recentUser.forEach(item => {
            avatarUrlList.map(subItem => {
                item.avatarUrl = subItem
            })
        })
    })
}
onLoad(() => {
    getList()
})
onShow(() => {
    getList()
})
</script>

<style scoped lang="less"> 
.title {
    display: flex;
    justify-content: center;
    margin-top: 8px;
    font-size: 18px;
    margin-bottom: 8px;
}

.image {
    width: 48px;
    height: 48px;
    position: absolute;
    bottom: 0;
    right: 0;
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
    right:-10px;
    top:-10px;
}

.header {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    margin: 4px;
}
</style>