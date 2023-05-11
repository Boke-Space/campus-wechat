<template>
  
    <van-cell-group inset v-if="type == 1 || type == 2">
      <van-cell title="是否完成">
        <view slot="right-icon">
          <van-switch :checked="status" active-value="1" inactive-value="0"	@change="onChange" />
      </view>
      </van-cell>
    </van-cell-group>

    <van-cell-group inset v-if="type == 2">
      <van-cell
        title="类别"
        :value="category"
        @click="isShowCategory = true"
        is-link
        required
      />
      <van-popup :show="isShowCategory" round="true" @close="isShowCategory = false" duration="500" position="bottom">
        <van-picker show-toolbar :columns="categoryList" @change="categoryChange" @confirm="isShowCategory = false" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display:flex;background-color:#fff;padding:10px">
        <span style="margin-right: 32px;color:#323232;font-size: 14px;"><span style="color: red;font-size: 12px;">*</span>物品</span>
        <input type="text" style="flex:1" v-model="title" @confirm="titleChange" />
      </view>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232; margin-right: 32px;font-size: 14px;margin-left: 4px">备注</span>
        <textarea style="flex: 1;" v-model="content" @confirm="contentChange" />
      </view>
    </van-cell-group>

    <van-cell-group inset v-if="type == 2 || type == 3">
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323233; margin-right: 32px;font-size: 14px;margin-left: 4px">价格</span>
        <input type="text" style="flex:1" v-model="title" @confirm="titleChange" />
      </view>
    </van-cell-group>

    <van-cell-group inset v-if="type == 3">
        <van-cell title="件数" required>
            <van-stepper :value="num" integer @change="numChange" />
        </van-cell>
    </van-cell-group>

    <van-cell-group inset v-if="type == 1">
      <view style="display:flex;background-color:#fff;padding:10px">
        <span style="margin-right: 32px;color:#323232;font-size: 14px;margin-left: 4px"><span style="color: red;font-size: 12px;">*</span>地点</span>
        <input type="text" style="flex:1" v-model="address" />
      </view>
    </van-cell-group>

    <van-cell-group inset v-if="type == 1">
      <van-cell title="时间" :value="time" @click="isShowTime = true" is-link  required />
      <van-popup :show="isShowTime" round="true" @close="isShowTime = false" duration="500" position="bottom">
        <van-datetime-picker type="datetime" :min-date="minDate" :value="second" @confirm="timeChange" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset v-if="type == 3">
      <van-cell title="送达时间" :value="time" @click="isShowTime = true" is-link  required />
      <van-popup :show="isShowTime" round="true" @close="isShowTime = false" duration="500" position="bottom">
        <van-datetime-picker type="datetime" :min-date="minDate" :value="second" @confirm="timeChange" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323232; margin-right: 32px;font-size: 14px;margin-left: 4px">手机</span>
        <input type="text" style="flex:1" v-model="phone" @confirm="phoneChange" />
      </view>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="住址" is-link :value="end" @click="selectDestination"/>
    </van-cell-group>

    <van-cell-group inset v-if="type == 3">
      <view style="display:flex;background-color:#fff;padding:10px">
        <span style="margin-right: 32px;color:#323232;font-size: 14px;"><span style="color: red;font-size: 12px;">*</span>门牌号</span>
        <input type="text" style="flex:1" v-model="address" />
      </view>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell v-if="type == 1 || type == 3" title="图片">
        <view slot="right-icon">
          <van-uploader
            style="margin-left: 16px"
            @after-read="afterRead"
          />
        </view>
      </van-cell>
      <van-cell v-if="type == 2" title="图片" required>
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
import { dateToSecond } from '@/utils/time';
import { onLoad } from '@dcloudio/uni-app'

let title = $ref('')
let content = $ref('')
let urlList = $ref<any>([])
let id = $ref(0)
let status = $ref(0)
let type = $ref(0)
let phone = $ref('')
let money = $ref('')
let address = $ref('')
let end = $ref('')
let time = $ref('')
let second = $ref('')
let isShowTime = $ref(false)
let minDate = new Date().getTime()
let category = $ref('')
let num = $ref(1)
let isShowCategory = $ref(false)
const categoryList = ['服饰鞋帽', '书籍资料', '生活用品', '数码电器', '其他']

const numChange = (e: any) => num = e.detail
const phoneChange = (event: any) => phone = event.detail.value
const titleChange = (event: any) => title = event.detail.value
const contentChange = (event: any) => content = event.detail.value


const categoryChange = async (e: any) => {
  const { picker, value, index } = e.detail
  category = value
}

const { username } = $(useLogin())
let { destination, selectDestination } = $(useMap())

onLoad((options: any) => {
  type = options.type
  const data = JSON.parse(options.item)
  title = data.title
  content = data.content
  urlList = data.urlList
  id = data.id
  status = data.status
  phone = data.phone
  money = data.money
  address = data.address
  time = data.time
  end = data.destination
  num = data.num
})

const timeChange = (e: any) => {
  time = dateToSecond(e.detail)
  second = e.detail
  isShowTime = false
}

const onChange = ({ detail }) => status = detail

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
  const params: any = {
    id,
    username,
    title,
    content,
    urlList,
    status,
    money,
    phone,
    address,
    destination,
    num
  }
  if (end !== '') params.destination = end
  await modifyArticleApi(params)
  uni.navigateBack({ delta: 1 })
}

watch($$(destination), (value) => {
  end = value
})

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

</style>
