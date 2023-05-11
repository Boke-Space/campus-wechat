<template>
    <view>
        <view style="display:flex;align-items: center;justify-content: center;height:150px;">
            <van-image round lazy-load width="6rem" height="6rem" :src="avatarUrl"  />
        </view>

        <button class="image" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <img style="width: 32px;height:32px" src="../static/camera.png" />
        </button>

        <!-- <input type="nickname" class="weui-input" placeholder="请输入昵称"/>
        <open-data type="userNickName"></open-data> -->

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">学号</span>
                <span>{{ userInfo.job }}</span>
            </view>
        </van-cell-group>

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">所在专业</span>
                <span>{{ userInfo.department }}系{{ userInfo.specialty }}</span>
            </view>
        </van-cell-group>

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">名字</span>
                <input type="text" style="flex:1" v-model="userInfo.username" @confirm="usernameChange" />
            </view>
        </van-cell-group>

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">电话</span>
                <input type="text" style="flex:1" v-model="userInfo.phone" @confirm="phoneChange" />
            </view>
        </van-cell-group>

        <van-cell-group inset>
            <view style="display:flex;background-color:#fff;padding:10px">
                <span style="color: #000000;margin-right: 32px;">邮箱</span>
                <input type="text" style="flex:1" v-model="userInfo.email" @confirm="emailChange" />
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

const usernameChange = (event) => userInfo.username = event.detail.value
const phoneChange = (event) => userInfo.phone = event.detail.value
const emailChange = (event) => userInfo.email = event.detail.value

const onChooseAvatar = (e) => {
    let headers = {
    'content-type': 'application/json',
    token: uni.getStorageSync('token') ?? '',
    }
    uni.uploadFile({
        url: 'http://localhost:8080/image', // 仅为示例，非真实的接口地址
        filePath: e.detail.avatarUrl,
        header: headers,
        name: 'file',
        formData: { user: 'test' },
        async success(res) {
            let result = JSON.parse(res.data)
            let id = uni.getStorageSync('id')
            avatarUrl = result.data.url
        },
    })
}

const handleEdit = async () => {
    const { username, phone, email } = $(userInfo)
    let id = uni.getStorageSync('id')
    const params = {
        avatarUrl,
        username,
        phone,
        email
    }
    if ((/^1[3456789]\d{9}$/.test(phone) === true) && (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLocaleLowerCase()) === true)) {
        await user.editInfo(params)
        const { data: { list } } = await findUser({ id })
        userInfo = list[0]
        uni.setStorageSync('username', username)
        uni.setStorageSync('avatarUrl', avatarUrl)
        uni.setStorageSync('phone', phone)
        uni.setStorageSync('email', email)
        uni.navigateBack({ delta: 1 })
    }  else uni.showToast({ icon: 'none', title: '请填写正确数据' })
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