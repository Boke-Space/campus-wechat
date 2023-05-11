<template>
    <view>
        <view class="header">
            <template v-for="(item, index) of list">
                <view class="day">
                    <view>{{ item }}</view>
                    <view>{{ weekList[index] }}</view>
                    <div class='left'></div>
                    <div class='right'></div>
                </view>
            </template>
        </view>
        <view class="list">
            <template v-for="item of titleList" :key="item.serial">
                <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
                <view class="first">
                    <view class="title">
                        <view style="font-size: 22px;">{{ item.serial }}</view>
                        <view>{{ item.start }}</view>
                        <view>{{ item.end }}</view>
                    </view>
                    <view class="room" v-for="subItem of titleList2" style="position: relative;">
                        <template v-for="course of courseList">
                            <view style="height: 150px;margin-top: -16px;" :class="courseMap.get(item.serial)" v-if="course.courseId == 5 * (item.serial - 1) + Number(subItem.id)" @click="handleClick(5 * (item.serial - 1) + Number(subItem.id), item, course)">
                                <view class="teacher">{{ course.teacher }}</view>
                                <view class="name">{{ course.name }}</view>
                                <view class="room">{{ course.room }}</view>
                                <view class="period">{{ course.period }}</view>
                            </view>
                            <view v-else @click="handleClick(5 * (item.serial - 1) + Number(subItem.id), item)" style="position:absolute;top: 50%;left:50%;transform: translate(-50%, -50%);opacity: 0">...</view>
                        </template>
                    </view>
                </view>
            </template>
        </view>

        <van-dialog
            use-slot
            title="详情"
            :show="show"
            width="370px"
            @close="show=false"
            @confirm="handleConfirm"
            show-cancel-button>
            <view>
                <van-cell-group inset>
                    <view style="display:flex;background-color:#fff;padding:10px">
                        <span style="color: #000000;margin-right: 32px;">课程</span>
                        <input type="text" style="flex:1" v-model="courseDetail.name" />
                    </view>
                </van-cell-group>
                <!-- <van-cell-group inset>
                    <view style="display:flex;background-color:#fff;padding:10px">
                        <span style="color: #000000;margin-right: 32px;">课室</span>
                        <input type="text" style="flex:1" v-model="courseDetail.room" />
                    </view>
                </van-cell-group> -->
                <van-cell-group inset>
                    <van-cell title="选择课室" :value="courseDetail.room" @click="isShowRoom = true" is-link />
                    <van-popup :show="isShowRoom" round="true" @close="isShowRoom = false" duration="500" position="bottom">
                        <van-picker show-toolbar title="选择课室" :columns="columns" @change="roomChange" @confirm="selectApprover" @cancel="isShowRoom = false" />
                    </van-popup>
                </van-cell-group>
                <van-cell-group inset>
                    <view style="display:flex;background-color:#fff;padding:10px">
                        <span style="color: #000000;margin-right: 32px;">老师</span>
                        <input type="text" style="flex:1" v-model="courseDetail.teacher" />
                    </view>
                </van-cell-group>
                <van-cell-group inset>
                    <view style="display:flex;background-color:#fff;padding:10px">
                        <span style="color: #000000;margin-right: 32px;">周数</span>
                        <input type="text" style="flex:1" v-model="courseDetail.period" />
                    </view>
                </van-cell-group>
            </view>
        </van-dialog>
    </view>
</template>

<script setup lang="ts">
import { getWeekTime } from '@/utils/time'

const weekList = getWeekTime()
const { username } = $(useLogin())
const list = ['周一', '周二', '周三', '周四', '周五']
let show = $ref(false)
let courseDetail = $ref<any>({})
let isShowRoom = $ref(false)

const titleList = [
    { serial: 1, start: '09:00', end: '10:20' },
    { serial: 2, start: '10:40', end: '12:00' },
    { serial: 3, start: '12:30', end: '13:50' },
    { serial: 4, start: '14:00', end: '15:20' },
    { serial: 5, start: '15:30', end: '16:50' },
    { serial: 6, start: '17:00', end: '18:20' },
    { serial: 7, start: '19:00', end: '20:20' },
    { serial: 8, start: '20:30', end: '21:50' },
]

const titleList2 = [
    { id: 1, start: '09:00', end: '10:20' },
    { id: 2, start: '10:40', end: '12:00' },
    { id: 3, start: '12:30', end: '13:50' },
    { id: 4, start: '14:00', end: '15:20' },
    { id: 5, start: '15:30', end: '16:50' },
]

const courseMap = new Map([
  [1, 'oneBg'],
  [2, 'twoBg'],
  [3, 'threeBg'],
  [4, 'fourBg'],
  [5, 'fiveBg'],
  [6, 'sixBg'],
  [7, 'sevenBg'],
  [8, 'eightBg'],
])

const citys = {
  A: ['101', '102', '201', '202', '301', '302', '303', '401', '402', '403'],
  B: ['101', '102', '201', '202', '301', '302', '303', '401', '402', '403'],
  C: ['101', '102', '201', '202', '301', '302', '303', '401', '402', '403'],
  T: ['101', '102', '201', '202', '301', '302', '303', '401', '402', '403'],
  S: ['101', '102', '201', '202', '301', '302', '303', '401', '402', '403'],
}

const columns = computed(() => [
  {
    values: Object.keys(citys),
    className: 'column1',
  },
  {
    values: citys['A'],
    className: 'column2',
  },
])

let courseList = $ref<any[]>([])

function roomChange(event) {
    const { picker, value, index } = event.detail
    courseDetail.room = `${value[0]}${value[1]}`
}

const selectApprover = (event) => {
    const { picker, value, index } = event.detail
    courseDetail.room = `${value[0]}${value[1]}`
    isShowRoom = false
}

const handleClick = (courseId, item, course = {}) => {
    show = true
    courseDetail = { ...item, ...course, username, courseId }
}

const handleConfirm = async () => {
    show = false
    const { start, end, serial, username, room, courseId, teacher, name, period } = courseDetail
    const params = { start, end, serial, username, room, courseId, teacher, name, period }
    console.log(params)
    if (!name || !teacher || !period || !room) uni.showToast({ icon: 'none', title: '请填写相关数据' })
    else {
        const { success } = await updateCourseListApi(params)
        if (success) {
            uni.showToast({ icon: 'none', title: '发布成功' })
            getList()
        }
        else uni.showToast({ icon: 'none', title: '发布失败' })
    }
}

const getList = async() => {
    const { data: { list } } = await getCourseListApi({ username })
    courseList = list
}
onMounted(async () => {
    // findUser({ username: username }).then(res => {
    //     let obj: any = {}
    //     const list: any[] = []
    //     const entires: [string, string][] = Object.entries(JSON.parse(res.data.list[0].course))
    //     for (const [key, value] of entires) {
    //         obj.id = value[0]
    //         obj.content = value[1]
    //         obj.teacher = value[2]
    //         obj.period = value[3]
    //         list.push(obj)
    //         obj = {}
    //     }
    //     course = list
    // })
    // const courseArray: any[] = []
    // list.map(item => {
    //     if (item.studentList.includes(username)) {
    //         courseArray.push(item)
    //     }
    // })
    // courseList = courseArray
    getList()
})
</script>

<style scoped lang="less">
.header {
    display: flex;
    margin-left: 64px;
}

.list {
    height: calc(100vh - 42px);
    overflow-y: auto;
}

.day {
    width: 150px;
    position: relative;
    text-align: center;

    .left {
        position: absolute;
        width: 1px;
        height: 100vh;
        background-color: #dcdfe6;
        left: 0; 
        top: 60px;
    }

    .right {
        position: absolute;
        width: 1px;
        height: 100vh;
        background-color: #dcdfe6;
        right: 0; 
        top: 60px;
    }

}

.first {
    height: 120px;
    display: flex;
    margin-bottom: 8px;

    .title {
        width: 64px;
        line-height: 40px;
        text-align: center;
    }

    .room {
        width: 70px;
        position: relative;

        .teacher {
            text-align: center;
        }

        .name {
            text-align: center;
            margin-top: 8px;
        }

        .room {
            text-align: center;
            margin-top: 8px;
        }

        .period {
            text-align: center;
            margin-top: 8px;
        }
    }
}

.oneBg {
  background-color: #519edf;
}

.twoBg {
  background-color: #eb9854;
}

.threeBg {
  background-color: #69ce9b;
}

.fourBg {
  background-color: #a38ef6;
}

.fiveBg {
  background-color: #ea7885;
}

.sixBg {
  background-color: #f1c14a;
}

.sevenBg {
  background-color: #66cbe8;
}

.eightBg {
  background-color: #f2782e;
}

</style>