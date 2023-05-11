<template>
  <view>
    <view class="date">
      {{ month }} 月 {{ day }} 日  星期 {{ week }}
    </view>
    <view class="flex">
      <img class="image" src="../static/course.png" />
      <view style="margin-left: 8px;font-size: 18px;">今日课程</view>
    </view>

    <view v-if="todayCourse.length !== 0" style="margin-bottom: 8px;">
      <view class="courseBox" v-for="item of todayCourse">
        {{ item.serial }} - {{ item.start }} - {{ item.end }} {{ item.room }} - {{ item.name }} - {{ item.teacher }} 
      </view>
    </view>

    <view v-else style="display: flex;align-items: center;justify-content: center;position:relative" >
      <img src="../static/break.png" />
      <view style="position:absolute;bottom: 10px">今日没课，休息一下吧</view>
    </view>

    <view class="flex">
      <img class="image" src="../static/express.png" />
      <view style="margin-left: 8px;font-size: 18px;">待送快递</view>
    </view>

    <view v-if="packageList.length == 0" style="display: flex;align-items: center;justify-content: center;position:relative" >
      <img src="../static/take.png" />
      <view style="position:absolute;bottom: 10px">当前没有需要待送的快递</view>
    </view>
    
    <view v-else style="margin: -8px;">
      <view v-for="(item, index) of packageList" :key="index">
        <van-swipe-cell left-width="80" right-width="80" @click="gotoDetail(item)">
          <view style="border-radius: 16px;background-color: #f7f8fa;padding: 0 10px">
            <view style="margin-bottom: 8px;margin-left: 16px;position:relative;padding-bottom: 16px;margin-bottom: 16px;">
              <view style="margin-top: 16px;display:flex;align-items: center;">
                    <view style="margin-top: 8px;margin-bottom: 8px;">
                        <span style="color:#388cea">送达时间：</span>
                        <span style="margin-left: 8px;">{{ item.time }}</span>
                    </view>
                </view>
                <view style="display: flex">
                    <van-icon name="location-o" size="32px" />
                        <view style="margin-left: 16px;flex:1">
                          <view>
                            <span>{{ item.destination }}</span>
                            <span style="color:#388cea">{{ item.address }}</span>
                          </view>
                        <view>
                            <span>{{ item.username }}</span>
                            <span style="color:#388cea;margin-left: 16px;">{{ item.phone }}</span>
                        </view>
                    </view>
                </view>
            </view>
          </view> 
          <view slot="left" @click="handleDelete(item)">取消接单</view>
          <view slot="right" @click="handleArrive(item)">物品送达</view>
        </van-swipe-cell>
      </view>
    </view>

    <view class="flex">
      <img class="image" src="../static/package.png" />
      <view style="margin-left: 8px;font-size: 18px;">未达包裹</view>
    </view>

    <view v-if="expressList.length == 0" style="display: flex;align-items: center;justify-content: center;position:relative" >
      <img src="../static/success.png" />
      <view style="position:absolute;bottom: 10px">当前没有需要代拿的包裹</view>
    </view>

    <view v-else style="margin: -8px;">
      <view v-for="(item, index) of expressList" :key="index">
          <view style="border-radius: 16px;background-color: #f7f8fa;padding: 0 10px" @click="gotoDetail(item)">
              <view style="margin-bottom: 8px;margin-left: 16px;position:relative;padding-bottom: 16px;margin-bottom: 16px;">
                <view style="margin-top: 16px;display:flex;align-items: center;">
                      <view style="margin-top: 8px;margin-bottom: 8px;">
                          <span style="color:#388cea">送达时间：</span>
                          <span style="margin-left: 8px;">{{ item.time }}</span>
                      </view>
                  </view>
                  <view style="display: flex">
                      <van-icon name="location-o" size="32px" />
                      <view style="margin-left: 16px;flex:1">
                          <view>
                              <span>商品名称 </span>
                              <span>{{ item.title }}</span>
                              <span style="margin-left: 16px;">商品数量 </span>
                              <span>{{ item.num }}</span>
                          </view>
                          <view>
                              <span>{{ item.receiver }}</span>
                              <span style="color:#388cea;margin-left: 16px;">{{ item.contact }}</span>
                          </view>
                      </view>
                  </view>
              </view>
          </view> 
      </view>
    </view>
    
    <view>
      <view class="flex">
        <img class="image" src="../static/function.png" />
        <view style="margin-left: 8px;font-size: 18px;">常用功能</view>
      </view>

      <view style="display: flex;justify-content: space-between;flex-wrap: wrap;margin-top: 8px;">
        <view style="margin-left:24px;background-color:#f7f8fa;position:relative;height:120px;width:40vw;border-radius: 16px;" @click="handleRoom">
          <img class="icon" src="../static/lost.png" />
          <view class="content">课室情况</view>
        </view>
        <view style="margin-right:24px;background-color:#f7f8fa;position:relative;height:120px;width:40vw;border-radius: 16px;" @click="applyRoom">
          <img class="icon" src="../static/apply.png" />
          <view class="content">课室申请</view>
        </view>
        <view style="margin-left:24px;margin-top: 16px;background-color:#f7f8fa;position:relative;height:120px;width:40vw;border-radius: 16px;" @click="handleCourse">
          <img class="icon" src="../static/course2.png" />
          <view class="content">课程信息</view>
        </view>
        <view style="margin-right:24px;margin-top: 16px;background-color:#f7f8fa;position:relative;height:120px;width:40vw;border-radius: 16px;" @click="handleUser">
          <img class="icon" src="../static/user.png" />
          <view class="content">查询用户</view>
        </view>
      </view>
      
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad, onShow } from '@dcloudio/uni-app';
import { timeCompare } from '@/utils/time'
import { getJsCode, getOpenId, getAccessToken } from '@/utils/subscribe';

const { username, phone } = $(useLogin())
let todayCourse = $ref<any[]>([])

const firstList  = ['1', '6', '11', '16', '21', '26', '31', '36']
const secondList = ['2', '7', '12', '17', '22', '27', '32', '37']
const threeList  = ['3', '8', '13', '18', '23', '28', '33', '38']
const fourList   = ['4', '9', '14', '19', '24', '29', '34', '39']
const FiveList   = ['5', '10', '15', '20', '25', '30', '35', '40']
const month = new Date().getMonth() + 1
const day = new Date().getDate()
const week = new Date().getDay()
const findToday = new Map([
  [1, firstList],
  [2, secondList],
  [3, threeList],
  [4, fourList],
  [5, FiveList],
])

let expressList = $ref<any[]>([])
let packageList = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
let promiseList: Promise<any>[] = []

const timeDiff = (time1: string) => {
  let Y = new Date().getFullYear()
  let M = (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1)
  let D = (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate())
  let date = `${Y}-${M}-${D}`
  let date1 = new Date(`${date} ${time1}`) as any
  return timeCompare(date1)
}

const getList = async () => {
  const { data: { list: express } } = await getArticleApi({ type: 3, status: 1, username })
  expressList = express
  express.map((item: any) => promiseList.push(findUser({ username: item.receiver })))
    Promise.all(promiseList).then((res: any) => {
      res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
      expressList.forEach((item, index) => {
          item.avatarUrl = avatarUrlList[index]
      })
  })
  promiseList = []
  avatarUrlList = []
  const { data: { list: parcel } } = await getArticleApi({ type: 3, status: 1, receiver: username })
  packageList = parcel
  parcel.map((item: any) => promiseList.push(findUser({ username: item.username })))
  Promise.all(promiseList).then((res: any) => {
    res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
    packageList.forEach((item, index) => {
        item.avatarUrl = avatarUrlList[index]
    })
  })
  promiseList = []
  avatarUrlList = []
  const { data: { list } } = await getCourseListApi({ username })
  const newList: any[] = []
  list.map(item => {
    if (!timeDiff(item.end)) {
      newList.push(item)
    }
  })
  const courseArray: any[] = []
  findToday.forEach((key, value) => {
    if (value === week) {
      findToday.get(week)?.forEach(item => {
        const todayList = newList.find((subItem) => item == subItem.courseId)
        if (todayList !== undefined) courseArray.push(todayList)
      })
    }
  })
  todayCourse = courseArray
}

onMounted(() => getList())
onShow(() => getList())

const handleRoom = () => uni.navigateTo({ url: `/components/Home/Room` })
const handleCourse = () => uni.navigateTo({ url: `/components/Home/Course` })
const applyRoom = () => uni.navigateTo({ url: `/components/Home/RoomApply` })
const handleUser = () => uni.navigateTo({ url: `/components/Home/User` })
const gotoDetail = (item) => uni.navigateTo({ url: `/components/Discover/ExpressDetail?item=${JSON.stringify(item)}` })

const handleDelete = async (item) => {
  const tmplIds = "JayEqDmPozmqhOkza6Pfs58G3FfXcph312YCw0AvwA0"
  const js_code: any = await getJsCode();
  const openId = await getOpenId(js_code);
  const accessToken = await getAccessToken();
  uni.requestSubscribeMessage({
      tmplIds: [tmplIds],
      success: async function(res) {
          if (res[tmplIds] === 'accept') {
            uni.showToast({ icon: 'none', title: '发布失败' })
          }
      }
  })
  const { errmsg } = await subscribeExpress({
    openId, accessToken, username, phone,
    status: '取消接单',
    address: item.destination + item.address,
    num: `${item.num}件货品`,
  })
  const { success } = await modifyArticleApi({ id: item.id, status: 0 })
  if (success && errmsg == 'ok') {
      uni.showToast({ icon: 'none', title: '取消成功' })
      await getList()
  } 
  else uni.showToast({ icon: 'none', title: '取消失败' })
}

const handleArrive = async (item) => {
  const tmplIds = "JayEqDmPozmqhOkza6Pfs58G3FfXcph312YCw0AvwA0"
  const js_code: any = await getJsCode();
  const openId = await getOpenId(js_code);
  const accessToken = await getAccessToken();
  uni.requestSubscribeMessage({
      tmplIds: [tmplIds],
      success: async function(res) {
          if (res[tmplIds] === 'accept') {
            uni.showToast({ icon: 'none', title: '发布失败' })
          }
      }
  })
  const { errmsg } = await subscribeExpress({
    openId, accessToken, username, phone,
    status: '已送达',
    address: item.destination + item.address,
    num: `${item.num}件货品`,
  })
  const { success } = await modifyArticleApi({ id: item.id, status: 2 })
  if (success && errmsg == 'ok') {
      uni.showToast({ icon: 'none', title: '送达成功' })
      await getList()
  } 
  else uni.showToast({ icon: 'none', title: '送达失败' })
}

  // findUser({ username  }).then(res => {
  //   let obj: any = {}
  //   const list: any[] = []
  //   for (const [key, value] of Object.entries(JSON.parse(res.data.list[0].course))) {
  //       obj.id = value[0]
  //       obj.content = value[1]
  //       obj.teacher = value[2]
  //       obj.period = value[3]
  //       obj.start = value[4]
  //       obj.end = value[5]
  //       obj.index = value[6]
  //       list.push(obj)
  //       obj = {}
  //   }
  //   course = list
  //   if (Object.keys(todayCourse).length == 0) {
  //     findToday.forEach((key, value) => {
  //       if (value === week) {
  //         findToday.get(week)?.forEach(item => {
  //           const todayList = list.find((subItem) => item === subItem.id)
  //           if (todayList !== undefined) todayCourse.push(todayList)
  //         })
  //       }
  //     })
  //   }
  // })
</script>

<style scoped="scoped" lang="less">
.date {
  padding: 10px;
  text-align: center;
  font-size: 18px;
  color: #1F75FE;
}

.flex {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.image {
  width: 32px;
  height: 32px;
}

.card-image {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
    height: 10px;
    width: 50px;
    height: 50px;
  }

.content {
  position: absolute;
  position: absolute;
  left: 50%;
  top: 72px;
  transform: translateX(-50%);
  font-size: 18px;
}

.icon {
  width: 52px;
  height: 52px;
  position: absolute;
  left: 50%;
  top: 16px;
  transform: translateX(-50%)
}


.courseBox {
  padding: 10px;
  margin: 6px;
  color: #006db8;
  background-color: #ebf1f5;
  border-left: 4px solid #006db8;
  font-size: 18px;
}

.notice {
    width:20px;
    height:20px;
    line-height:20px;
    font-size:10px;
    color:#fff;
    text-align:center;
    background-color:#f00;
    border-radius:50%;
    position:absolute;
    right:0px;
    top:0px;
}

:deep(.van-swipe-cell__right) {
  display: inline-block;
  font-size: 15px;
  color: #fff;
  text-align: center;
  background-color: #5193fb;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}

:deep(.van-swipe-cell__left) {
  display: inline-block;
  font-size: 15px;
  color: #fff;
  text-align: center;
  background-color: #ee0a24;
  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-pack: center;
  -webkit-box-align: center;
}
</style>
