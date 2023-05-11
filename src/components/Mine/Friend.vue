<template>
    <view v-for="item of fansList" class="like">
        <div class="header">
            <van-image round lazy-load width="2.5rem" height="2.5rem" :src="item.avatarUrl" @click="gotoPerson(item.username)" />
            <div class="username">
                <div>{{ item.username }}</div>
                <div>学号:{{ item.job }}</div>
            </div>
            <view style="margin-top: 8px;position:absolute;right:64px;">
                <span v-if="likeList.includes(item.username)" @click="handleLike(false, item.username)">取消关注</span>
                <span v-else @click="handleLike(true, item.username)">关注</span>
            </view>
        </div>
        <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
    </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app';
const { user } = $(useLogin())
let likeList = $ref<any[]>([])
let fansList = $ref<any[]>([])

const gotoPerson = (username) => uni.navigateTo({ url: `../Person?username=${username}` })

const handleLike = async (flag: boolean, username) => {
    await user.modifyUser(flag, username)
    likeList = uni.getStorageSync('likeList')
}

const getFansList = async () => {
    fansList = uni.getStorageSync('fansList')
    likeList = uni.getStorageSync('likeList')
}

onShow(() => getFansList())
onMounted(() => getFansList())
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