<template>
    <view>
        <view v-for="(item, index) of messageList" :key="index" @click="handleRead(item.id)">
            <view>
                <view style="display:flex;margin-top: 8px;margin-left: 16px;">
                    <view class="dot" v-if="item.isRead == 0"></view>
                    <van-image round lazy-load width="3rem" height="3rem" style="margin-top: 8px;" :src="item.avatarUrl" @click="gotoPerson(item.sender)"  />
                    <view class="username">
                        <view>{{ item.sender }} 收藏了你的帖子</view>
                        <view>{{ item.createTime }}</view>
                    </view>
                </view>
            </view>
            <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
        </view>
    </view>
</template>

<script setup lang="ts">
const { username } = $(useLogin())
let messageList = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []

const gotoPerson = (username) => uni.navigateTo({ url: `../Person?username=${username}` })

const handleRead = async (id) => {
    await modifyMessageApi({ id, isRead: "1" })
    getMessageList()
}

const getMessageList = async () => {
    const { data: { list } } = await getMessageApi({ recipient: username, type: '1' })
    messageList = list
    list.map((item: any) => promiseList.push(findUser({ username: item.sender })))
    Promise.all(promiseList).then((res: any) => {
    res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
        messageList.forEach((item, index) => {
            item.avatarUrl = avatarUrlList[index]
        })
    })
}

onMounted(() => getMessageList())
</script>

<style scoped lang="less">
.username {
  margin-left: 16px;
  margin-top: 4px;
}


.dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color:#409EFF;
  margin-top: 16px;
  margin-right: 16px;
}
</style>