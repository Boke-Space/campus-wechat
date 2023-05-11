<template>
    <view class="title">用户列表</view>
        <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
            <van-field
                :value="username"
                @change="usernameChange"
                @confirm="usernameChange"
                center
                clearable
                placeholder="请输入用户名"
                use-button-slot
            >
                <view slot="button" size="small" type="primary" round @click="handleSearch">
                    <van-icon name="search" />
                </view>
            </van-field>
        <view v-for="item of userList" class="like">
            <div class="header">
                <van-image round lazy-load width="2.5rem" height="2.5rem" :src="item.avatarUrl" @click="gotoPerson(item.username)" />
                <div class="username">
                    <div>{{ item.username }}</div>
                    <div>学号:{{ item.job }}</div>
                </div>
            </div>
            <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
    </view>
</template>

<script setup lang="ts">
let userList = $ref<any[]>([])
let username = $ref('')
const usernameChange = (e: any) => username = e.detail
onMounted(() => getList())
const getList = (params = {}) => userList = searchUser(params).then(res => userList = res.data.userList)
const gotoPerson = (username) => uni.navigateTo({ url: `../Person?username=${username}` })
const handleSearch = () => getList({ username })
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
  }
}

:deep(.van-cell)  {
    border-radius: 24px;
    width: 90vw;
    margin-left: 5vw;
    border: 2px #4ea1de solid;
}
</style>