<template>
    <view>
        <view style="display:flex;align-items: center;justify-content: center;height:150px;">
            <van-image round lazy-load width="6rem" height="6rem" :src="avatarUrl"  />
        </view>

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">学号</span>
                <span>{{ userInfo.username }}</span>
            </view>
        </van-cell-group>

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">密码</span>
                <input type="password" style="flex:1" v-model="password" @confirm="passwordChange" />
            </view>
        </van-cell-group>

        <van-button type="info" size="large" round @click="handleEdit">确定修改</van-button>
    </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
const { user } = $(useLogin())

let userInfo = $ref<any>({})
let avatarUrl = $ref('')
let password = $ref('')

const passwordChange = (event) => password = event.detail.value

const handleEdit = async () => {
    let id = uni.getStorageSync('id')
    const params = {
        password
    }
    await user.editInfo(params)
    const { data: { list } } = await findUser({ id })
    userInfo = list[0]
}

onLoad((options: any) => {
    const data = JSON.parse(options.item)
    userInfo = data
    avatarUrl = data.avatarUrl
})
</script>

<style scoped lang="less">
:deep(.van-cell-group) {
  margin: 16px;
}

.image {
    width: 60px;
    height: 32px;
    border: none;
}

:deep(.van-button) {
  width: 90%;
  margin-left: 5%;
  margin-top: 16px;
}
</style>