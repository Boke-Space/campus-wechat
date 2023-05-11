<template>
  <van-cell-group inset>
    <view style="display: flex; background-color: #fff; padding: 10px">
      <span style="color: #000000; margin-right: 32px">标题</span>
      <input type="text" style="flex: 1" v-model="title" />
    </view>
  </van-cell-group>
  
  <van-cell-group inset>
    <view style="display: flex; background-color: #fff; padding: 10px;">
      <span style="color: #000000; margin-right: 32px">内容</span>
      <textarea style="flex: 1;" v-model="content" />
    </view>
  </van-cell-group>

  <van-cell-group inset>
    <van-cell
      title="选择地点"
      is-link
      :value="destination"
      @click="selectDestination"
    />
  </van-cell-group>

  <van-cell-group inset>
    <van-cell title="选择图片">
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

  <van-button round type="info" @click="submit">编辑帖子</van-button>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

let title = $ref('')
let content = $ref('')
let urlList = $ref<any>([])
let id = $ref(0)

onLoad((options: any) => {
  title = JSON.parse(options.item).title
  content = JSON.parse(options.item).content
  urlList = JSON.parse(options.item).urlList
  destination = JSON.parse(options.item).destination
  id = JSON.parse(options.item).id
})

const { username } = $(useLogin())
let { destination, selectDestination } = useMap()

const afterRead = (e: any) => {
  const { file } = e.detail
  let headers = {
    'content-type': 'application/json',
    token: uni.getStorageSync('token') ?? '',
  }
  uni.uploadFile({
    url: 'http://localhost:8080/image', // 仅为示例，非真实的接口地址
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
  let index = e.currentTarget.dataset.index
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
    username: username,
    urlList,
    content,
    id,
  }
  await modifyNotice(params)
  uni.navigateBack({ delta: 1 })
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

:deep(.van-button) {
  width: 90%;
  margin-left: 5%;
  margin-top: 16px;
}
</style>
