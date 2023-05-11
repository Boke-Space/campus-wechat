<template>
<van-cell-group inset>
      <view style="margin-left: 16px;display:flex">
        <view>类型:</view>
        <radio-group @change="categoryChange" style="margin-left: 16px;">
          <label>
            <radio value="小型" :checked="category === '小型'" color="#1989fa" />小型物品
            <radio value="中型" :checked="category === '中型'" color="#1989fa" />中型物品
            <radio value="大型" :checked="category === '大型'" color="#1989fa" />大型物品
          </label>
        </radio-group>
      </view>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232;margin-right: 32px;"><span style="color: red;font-size: 12px;">*</span>物品</span>
        <input style="flex: 1;" v-model="title" @confirm="titleChange"	 />
      </view>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232; margin-right: 32px;font-size: 14px;margin-left: 4px">备注</span>
        <textarea style="flex: 1;" v-model="content" @confirm="contentChange" />
      </view>
    </van-cell-group>

    <van-cell-group inset>
        <view style="display:flex;background-color:#fff;padding:10px">
            <span style="margin-right: 32px;color:#323232;">
                <span style="color: red;font-size: 14px;">*</span>价格
            </span>
            <input type="number" style="flex:1" v-model="price" @confirm="priceChange" />
        </view>
    </van-cell-group>

    <van-cell-group inset>
        <van-cell title="件数" required>
            <van-stepper :value="num" integer @change="numChange" />
        </van-cell>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="送达时间" :value="time" @click="isShowTime = true" is-link required />
      <van-popup :show="isShowTime" round="true" @close="isShowTime = false" duration="500" position="bottom">
        <van-datetime-picker type="datetime" :min-date="minDate" :value="second" @confirm="timeChange" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232;margin-right: 32px;color:#323232;font-size: 14px;"><span style="color: red;font-size: 12px;">*</span>手机</span>
        <input style="flex: 1;" v-model="phone" @confirm="phoneChange"	 />
      </view>
    </van-cell-group>

    <van-cell-group inset>
        <van-cell required title="地址" is-link :value="destination" @click="selectDestination" />
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232; margin-right: 32px;font-size: 14px;margin-left: 4px">门牌号</span>
        <input style="flex: 1;" v-model="address" @confirm="addressChange"	 />
      </view>
    </van-cell-group>

    <van-cell-group inset>
        <van-cell title="图片">
            <view slot="right-icon">
                <van-uploader style="margin-left: 16px" @after-read="afterRead" />
            </view>
        </van-cell>
        <view class="imageInfo" style="margin-top: 16px;" v-for="(item, index) in urlList">
            <image class="imageInfo" :src="item" :tabindex="index" aspectFill @click="previewImg">
                <van-icon class="delete-btn" name="close" :tabindex="index" @click="deleteImg" />
            </image>
        </view>
    </van-cell-group>

    <van-button round type="info" size="large" @click="submit">提交申请</van-button>
</template>
  
<script setup lang="ts">
import { getAccessToken, getJsCode, getOpenId } from '@/utils/subscribe';
import { dateToSecond } from '@/utils/time';

const { username } = $(useLogin())
const { destination, selectDestination } = $(useMap())

let title = $ref('')
let content = $ref('')
let price = $ref('')
let address = $ref('')
let urlList = $ref<any>([])
let phone = $ref('')
let category = $ref('小型')
let time = $ref('')
let second = $ref('')
let isShowTime = $ref(false)
let num = $ref(1)
let minDate = new Date().getTime()

const titleChange = (event) => title = event.detail.value
const contentChange = (event) => content = event.detail.value
const priceChange = (event) => price = event.detail.value
const phoneChange = (event: any) => phone = event.detail.value
const addressChange = (event: any) => address = event.detail.value
const categoryChange = (e: any) => category = e.detail.value
const numChange = (e: any) => num = e.detail

const timeChange = (e: any) => {
  time = dateToSecond(e.detail)
  second = e.detail
  isShowTime = false
}

const afterRead = (e: any) => {
    const { file } = e.detail
    let headers = {
        'content-type': 'application/json',
        token: uni.getStorageSync('token') ?? '',
    }
    uni.uploadFile({
        url: 'http://localhost:8080/image',
        filePath: file.url,
        header: headers,
        name: 'file',
        formData: { user: 'test' },
        success(res) {
            let result = JSON.parse(res.data)
            urlList.push(result.data.url)
        },
    })
}

const previewImg = (e) => {
    var index = e.currentTarget.dataset.index
    uni.previewImage({
        current: urlList[index],
        urls: urlList,
    })
}

const deleteImg = (e) => {
    var index = e.currentTarget.dataset.index
    urlList.splice(index, 1)
}

const submit = async () => {
    const params = {
        type: 3,
        price,
        num,
        time,
        title,
        username,
        category,
        content,
        urlList,
        destination,
        address,
        phone
    }
    if ([title, price, num, time, phone, destination].includes('')) uni.showToast({ icon: 'none', title: '请填写相关数据' })
    if (/^1[3456789]\d{9}$/.test(phone) && !isNaN(price) === true) {
        const tmplIds = "JayEqDmPozmqhOkza6Pfs58G3FfXcph312YCw0AvwA0"
        uni.requestSubscribeMessage({
            tmplIds: [tmplIds],
            success: async function(res) {
                if (res[tmplIds] === 'accept') {
                        const js_code: any = await getJsCode();
                        const openId = await getOpenId(js_code);
                        const accessToken = await getAccessToken();
                        const { success } = await postArticleApi({ ...params, openId, accessToken })
                        if (success) {
                            uni.showToast({ icon: 'none', title: '发布成功' })
                            setTimeout(() => {
                                uni.navigateBack({ delta: 1 })
                            }, 1000)
                        }
                        else uni.showToast({ icon: 'none', title: '发布失败' })
                    } else {
                        uni.showToast({ icon: 'none', title: '发布失败' })
                    }
            }
        })
    }  else uni.showToast({ icon: 'none', title: '请填写正确数据' })
}

</script>
  
<style scoped lang="less">
:deep(.van-cell-group) {
    margin: 10px;
}

:deep(.van-picker) {
    height: 40vh;
    width: 100vw;
}

:deep(.van-button) {
    width: 90%;
    margin-left: 5%;
    margin-top: 16px;
}

.imageInfo {
    float: left;
    position: relative;
    border: 1rpx solid #ccc;
    border-radius: 2rpx;
    width: 30%;
    height: 80px;
    margin: 2rpx 6rpx;

    image {
        width: 100%;
        height: 100%;
    }
}

.delete-btn {
    position: absolute;
    top: 0;
    right: 0;

    button {
        width: 100%;
        margin-top: 10rpx;
    }
}

:deep(.van-field__label) {
  color: #323233 !important;
}

</style>
  