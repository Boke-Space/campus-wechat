<template>

<van-cell-group inset>
      <van-cell
        title="申请理由"
        :value="reason"
        @click="isShowReason = true"
        is-link
        required
      />
      <van-popup :show="isShowReason" round="true" @close="isShowReason = false" duration="500" position="bottom">
        <van-picker show-toolbar :columns="reasonList" @change="reasonChange" @confirm="reasonConfirm" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset>
      <view style="display: flex; background-color: #fff; padding: 10px;">
        <span style="color: #323233; margin-right: 32px">内容</span>
        <textarea style="flex: 1;" v-model="content" @confirm="contentChange"	 />
      </view>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        title="选择课室"
        :value="room"
        @click="isShowRoom = true"
        is-link
        required
      />
      <van-popup :show="isShowRoom" round="true" @close="isShowRoom = false" duration="500" position="bottom">
        <van-picker show-toolbar :columns="roomList" @change="roomChange" @confirm="roomConfirm" />
      </van-popup>
    </van-cell-group>

    <van-cell-group inset>
      <van-cell
        title="选择日期"
        :value="applyDate"
        @click="isShowDate = true"
        is-link
        required
      />
      <van-calendar
        :show="isShowDate"
        @close="isShowDate = false"
        @confirm="dateConfirm"
        :formatter="formatter"
        :min-date	="minDate"
        :max-date="maxDate"
        color="#1989fa"
      />
    </van-cell-group>

    <van-cell-group inset>
      <van-cell title="选择时间" :value="approver" @click="isShow = true" is-link required />
      <van-popup :show="isShow" round="true" @close="isShow = false" duration="500" position="bottom">
        <van-picker show-toolbar title="选择时间" :columns="timeList" @change="onChange" @confirm="selectApprover" />
      </van-popup>
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
import { getJsCode, getOpenId, getAccessToken } from '@/utils/subscribe';
import { timeCompare } from '@/utils/time'
import { chooseList } from '../../data/room';

const { username, department, specialty } = $(useLogin())

let roomList = $ref<any[]>([])
let selectList = $ref<any[]>([])
let timeList = $ref<any[]>([])

let isShowReason = $ref(false)
let content = $ref('')
let reason = $ref('')
let room = $ref('')
let isShowRoom = $ref(false)
let start = $ref('')
let end = $ref('')
let approver = $ref('')
let isShow = $ref(false)
let urlList = $ref<any>([])
let applyDate = $ref<any>()
let isShowDate = $ref<any>()
let week = $ref(0)
let timeIndex = $ref(0)
const date = new Date()
const minDate =  new Date().setDate(date.getDate())
const maxDate = date.setDate(date.getDate() + 7)

const firstList  = ['1', '6', '11', '16', '21', '26', '31', '36']
const secondList = ['2', '7', '12', '17', '22', '27', '32', '37']
const threeList  = ['3', '8', '13', '18', '23', '28', '33', '38']
const fourList   = ['4', '9', '14', '19', '24', '29', '34', '39']
const FiveList   = ['5', '10', '15', '20', '25', '30', '35', '40']

const timeMap = new Map([
  [1, firstList],
  [2, secondList],
  [3, threeList],
  [4, fourList],
  [5, FiveList],
])

const map = new Map([
  [0, '09:00-10:20'],
  [1, '10:40-12:00'],
  [2, '12:30-13:50'],
  [3, '14:00-15:20'],
  [4, '15:30-16:50'],
  [5, '17:00-18:20'],
  [6, '19:00-20:20'],
  [7, '20:30-21:50'],
])
const reasonList = ['社团活动', '开展班会', '其他']

const contentChange = (event) => content = event.detail.value

const reasonChange = async (e: any) => {
  const { picker, value, index } = e.detail
  reason = value
}

const roomChange = async (e: any) => {
  const { picker, value, index } = e.detail
  room = value
}

const isInclude = (arr1, arr2) => arr2.every((val) => arr1.includes(val))
// 交集
const intersect = (arr1, arr2) => arr1.filter((item) => arr2.includes(item))


const reasonConfirm = async (e) => {
  isShowReason = false
  reason = e.detail.value
}

const roomConfirm = async (e) => {
  isShowRoom = false
  room = e.detail.value
  const { data } = await getRoomListApi({ room })
  selectList = data.selectList
}

const formatDate = (date) => {
  date = new Date(date);
  let month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  return `${month}-${day}`
}

const formatter = (day) => {
  const week = day.date.getDay()
  if (week === 0 || week === 6) day.type = 'disabled'
  return day
}

const timeDiff = (time1: string) => {
  let Y = new Date().getFullYear()
  let M = (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
  let D = (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
  let date = `${Y}-${M}-${D}`
  let date1 = new Date(`${date} ${time1}`) as any
  return timeCompare(date1)
}


function onChange(e: any) {
  const { picker, value } = e.detail
  start = value.slice(0, 5)
  end = value.slice(6)
}

const selectApprover = (e) => {
  isShow = false
  start = e.detail.value.slice(0, 5)
  end = e.detail.value.slice(6)
  approver = `${start}-${end}`
  for(let [ key, value ] of map.entries()){
    if (value === approver) timeIndex = key
  }
}

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

const dateConfirm = async (e: any) => {
  isShowDate = false
  const { data } = await getRoomListApi({ room })
  selectList = data.selectList
  applyDate = formatDate(e.detail)
  week = e.detail.getDay()
  const todayList = timeMap.get(week) as string[]
  const list: string[] = []
  intersect(selectList, todayList).map((item: string) => {
    todayList.map((subItem: string, index: number) => {
      if (item === subItem) {
        // if (!timeDiff(map.get(index)?.slice(0, 5) as string)) {
          list.push(map.get(index) as string)
        // }
      }
    })
  })
  timeList = list
}
// const sendMsg = async () => {
//   const js_code = await getJsCode();
//   const openid = await getOpenId(js_code);
//   const access_token = await getAccessToken();
//   uni.request({
//     url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + access_token,
//     method: 'POST',
//     data: {
//       touser: openid,
//       template_id: 'ee0FemkXfMCnXTjH0CJf1Tuz6rrYAQR5_3jId_Qj4R0', // 第一个模板id
//       page: "pages/Home",                     
//       data: {                                  
//         date3: {  
//           value: '2022-06-04 20:33:44'
//         },
//         thing2: {
//           value: '审批通过'
//         },
//         thing6: {
//           value: '123'
//         }
//       }
//     },
//     success: (res) => {
//       console.log(res);
//     }
//   })
// }

const submit = async () => {
  const serial = 5 * timeIndex + week
  const FinishTime = `${new Date().getFullYear()}-${applyDate} ${end}:00`
  const params = { applicant: username, applyDate, FinishTime, start, end, urlList, room, reason, content, serial }
  const applyTime = `${new Date().getFullYear()}-${applyDate} ${start}:00`
  let isOver = timeCompare(applyTime)
  if (isOver) uni.showToast({ title: '当前时间大于预约时间，无法预约', icon: 'none' })
  else {
    if ([reason, room, applyDate, start, end].includes('')) uni.showToast({ icon: 'none', title: '请填写相关数据' })
    else {
      const templateIds = 'ee0FemkXfMCnXTjH0CJf1Tuz6rrYAQR5_3jId_Qj4R0'
      uni.requestSubscribeMessage({
        tmplIds: [templateIds],
        success: async function(res) {
            if (res[templateIds] === 'accept') {
              const js_code: any = await getJsCode();
              const openId = await getOpenId(js_code);
              const accessToken = await getAccessToken();
              const query = { ...params, openId, accessToken, department, specialty }
              const { success } = await applyRoomListApi(query)
              if (success) {
                uni.showToast({ icon: 'none', title: '申请成功' })
                setTimeout(() => {
                  uni.switchTab({ url: '/pages/Home' })
                }, 1000)
              }
              else uni.showToast({ icon: 'none', title: '申请失败' })
            } else {
              uni.showToast({ icon: 'none', title: '申请失败' })
            }
          }
      })
    }
  }
}

onMounted(async () => {
  const { data } = await getRoomListApi()
  // roomList = data.roomList
  const newList: any[] = []
  chooseList.map(item => {
    if (data.roomList.includes(item.value)) {
      newList.push(item.label)
    }
  })
  roomList = newList
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
