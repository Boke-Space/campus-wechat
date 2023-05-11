<template>
    <view>
        <van-cell-group inset>
            <van-field :value="job" @input="usernameChange" @confirm="usernameChange" required clearable label="学号" />
        </van-cell-group>
        <van-cell-group inset>
            <van-field :value="password" @change="passwordChange" @confirm="passwordChange" password required clearable
                label="密码" />
        </van-cell-group>
        <van-button type="info" size="large" round @click="handleLogin">点击登录</van-button>
    </view>
</template>

<script setup lang="ts">
const { user } = $(useLogin())
let job = $ref('')
let password = $ref('')

const usernameChange = (e: any) => job = e.detail

const passwordChange = (e: any) => password = e.detail

// 获取access_token
function getAccessToken() {
    return new Promise((resolve, reject) => {
        uni.request({
            url: 'https://api.weixin.qq.com/cgi-bin/token',
            data: {
                appid: 'wx7c8cb16a1beecb81',
                secret: 'cc140d91e9c3f4a91673341da445100b',
                grant_type: 'client_credential'
            },
            success: (res) => {
                resolve(res.data.access_token)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

const getJsCode = () => {
    return new Promise((resolve, reject) => {
        uni.login({
            success(res) {
                resolve(res.code)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

const getOpenId = (js_code) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `https://api.weixin.qq.com/sns/jscode2session`,
            data: {
                appid: 'wx7c8cb16a1beecb81',
                secret: 'cc140d91e9c3f4a91673341da445100b',
                grant_type: 'authorization_code',
                js_code,
            },
            success: (res) => {
                resolve(res.data.openid)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}

const handleLogin = async () => {
    // const js_code = await getJsCode();
    // const openId = await getOpenId(js_code);
    // const accessToken = await getAccessToken();
    const res = await user.login({ job, password })
    if (res === true) {
        uni.switchTab({ url: `../pages/Home` })
        uni.showToast({
            title: '登录成功',
            icon: 'none',
        })
    } else {
        uni.showToast({
            title: '登录失败',
            icon: 'none',
        })
    }
}
</script>

<style scoped>
:deep(.van-cell-group) {
    margin-top: 16px;
}

:deep(.van-button) {
    margin-top: 32px;
    margin-left: 5%;
    width: 90%;
}
</style>