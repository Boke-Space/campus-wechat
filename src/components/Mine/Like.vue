<template>
    <view v-for="item of likeList" class="like">
        <div class="header">
            <van-image round lazy-load width="2.5rem" height="2.5rem" :src="item.avatarUrl" @click="gotoPerson(item.username)" />
            <div class="username">
                <div>{{ item.username }}</div>
                <div>学号:{{ item.job }}</div>
            </div>
            <view style="margin-top: 8px;position:absolute;right:64px;">
                <span  @click="handleLike(false, item.username)">取消关注</span>
            </view>
        </div>
        <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
    </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';

const { user } = $(useLogin())
let promiseList: Promise<any>[] = []
let likeList = $ref<any[]>([])

const handleLike = async (flag: boolean, username) => {
    await user.modifyUser(flag, username)
    uni.getStorageSync('likeList').map((item: any) => promiseList.push(findUser({ username: item })))
    let list: any[] = []
    Promise.all(promiseList).then((res: any) => {
        res.forEach(item => list.push(item.data.list[0]))
        likeList = list
    })
    list = []
    promiseList = []
}

const getLikeList = () => {
    uni.getStorageSync('likeList').map((item: any) => promiseList.push(findUser({ username: item })))
    let list: any[] = []
    Promise.all(promiseList).then((res: any) => {
        res.forEach(item => list.push(item.data.list[0]))
        likeList = list
    })
    list = []
    promiseList = []
}

const gotoPerson = (username) => uni.navigateTo({ url: `../Person?username=${username}` })

onShow(() => getLikeList())
onMounted(() => getLikeList())
</script>

<style scoped lang="less">
.title {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    font-size: 18px;
}
.like {
    padding: 10px;
}

.header {
  display: flex;
  margin-left: 24px;
  margin-top: 8px;

  .username {
    margin-left: 16px;
    // margin-top: 8px;
  }
}
</style>