<template>

  <van-cell-group inset>
      <van-cell
        title="类别"
        :value="category"
        @click="isShowCategory = true"
        is-link
        required
      />
      <van-popup :show="isShowCategory" round="true" @close="isShowCategory = false" duration="500" position="bottom">
        <van-picker show-toolbar :columns="categoryList" @change="categoryChange" @confirm="categoryConfirm" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232;margin-right: 32px;font-size: 14px;"><span style="color: red;font-size: 12px;">*</span>物品</span>
        <input style="flex: 1;" inputmode="numeric" v-model="title" @confirm="titleChange" />
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
      <span style="color: #000000;margin-right: 32px;color:#323232;font-size: 14px;"><span style="color: red;font-size: 12px;">*</span>价格</span>
      <input type="text" style="flex:1" v-model="price" />
    </view>
  </van-cell-group>

  <van-cell-group inset>
    <van-cell title="住址" is-link :value="destination" @click="selectDestination"  />
  </van-cell-group>


  <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232;margin-right: 32px;color:#323232;font-size: 14px;margin-left: 4px">手机</span>
        <input style="flex: 1;" v-model="phone" @confirm="phoneChange"	 />
      </view>
    </van-cell-group>

  <van-cell-group inset>
    <van-cell title="图片">
      <view slot="right-icon">
        <van-uploader
          style="margin-left: 16px"
          @after-read="afterRead"
        />
    </view>
    </van-cell>
    <view class="imageInfo" style="margin-top: 16px;" v-for="(item, index) in urlList">
      <image
        class="imageInfo"
        :src="item"
        :tabindex="index"
        aspectFill
        @click="previewImg"
      >
        <van-icon
          class="delete-btn"
          name="close"
          :tabindex="index"
          @click="deleteImg"
        />
      </image>
    </view>
  </van-cell-group>

  <van-button round type="info" size="large" @click="submit">提交申请</van-button>

</template>

<script setup lang="ts">
const { username } = $(useLogin())
const { destination, selectDestination } = $(useMap())

let title = $ref('')
let content = $ref('')
let price = $ref('')
let urlList = $ref<any>([])
let phone = $ref('')
let category = $ref('')
let isShowCategory = $ref(false)
const categoryList = ['服饰鞋帽', '书籍资料', '生活用品', '数码电器', '其他']

const titleChange = (event) => title = event.detail.value
const contentChange = (event) => content = event.detail.value
const phoneChange = (event) => phone = event.detail.value

const categoryChange = async (e: any) => {
  const { picker, value, index } = e.detail
  category = value
}

const categoryConfirm = async (e: any) => {
  const { picker, value, index } = e.detail
  category = value
  isShowCategory = false
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

const handleSubmit = async (params) => {
  const { success } = await postArticleApi(params)
  if (success) uni.showToast({ icon: 'none', title: '发布成功' })
  else uni.showToast({ icon: 'none', title: '发布失败' })
  setTimeout(() => {
    uni.navigateBack({ delta: 1 })
  }, 500)
}

const submit = async () => {
  const params = {
    type: 2,
    title,
    price,
    username,
    category,
    content,
    urlList,
    destination,
    phone
  }
  if ([title, category, price].includes('')) uni.showToast({ icon: 'none', title: '请填写相关数据' })
  else {
    if (phone.length === 0) {
      if (!isNaN(price) === true) handleSubmit(params)
      else uni.showToast({ icon: 'none', title: '请填写正确数据' })
    } else {
      if (/^1[3456789]\d{9}$/.test(phone) && !isNaN(price) === true) handleSubmit(params)
      else uni.showToast({ icon: 'none', title: '请填写正确数据' })
    }
  }
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
