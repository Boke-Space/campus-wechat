<template>
    <view>
        <van-cell-group inset>
            <van-cell
                title="选择课室"
                :value="room"
                @click="isShowRoom = true"
                is-link
            />
            <van-popup :show="isShowRoom" round="true" @close="isShowRoom = false" duration="500" position="bottom">
                <van-picker show-toolbar :columns="roomList" @change="roomChange" @confirm="selectRoom" />
            </van-popup>
        </van-cell-group>
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
            <template v-for="item of titleList" :key="item.id">
                <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
                <view class="first">
                    <view class="title">
                        <view style="font-size: 22px;">{{ item.id }}</view>
                        <view>{{ item.start }}</view>
                        <view>{{ item.end }}</view>
                    </view>
                    <view class="room" v-for="room of titleList2" >
                        <template v-for="subItem of situation">
                            <view style="height: 150px;background-color: #ee0a24;margin-top: -16px;" v-if="subItem.serial == 5 * (item.id - 1) + Number(room.id) && subItem.isUse == '0' && subItem.status !== '0' && subItem.status !== '3'">
                                <view class="content">{{ subItem.applicant }}</view>
                                <view class="status">{{ subItem.reason }}</view>
                                <view v-if="subItem.status == 1" class="status">申请中</view>
                                <view v-if="subItem.status == 2" class="status">使用中</view>
                                <view class="teacher">{{ subItem.createTime.slice(5, 16) }}</view>
                            </view>
                        </template>
                    </view>
                </view>
            </template>
        </view>
    </view>
</template>

<script setup lang="ts">
import { getWeekTime } from '@/utils/time'
import { chooseList } from '../../data/room';

const weekList = getWeekTime()

const list = ['周一', '周二', '周三', '周四', '周五']
const titleList = [
    { id: 1, start: '09:00', end: '10:20' },
    { id: 2, start: '10:40', end: '12:00' },
    { id: 3, start: '12:30', end: '13:50' },
    { id: 4, start: '14:00', end: '15:20' },
    { id: 5, start: '15:30', end: '16:50' },
    { id: 6, start: '17:00', end: '18:20' },
    { id: 7, start: '19:00', end: '20:20' },
    { id: 8, start: '20:30', end: '21:50' },
]

const titleList2 = [
    { id: 1, start: '09:00', end: '10:20' },
    { id: 2, start: '10:40', end: '12:00' },
    { id: 3, start: '12:30', end: '13:50' },
    { id: 4, start: '14:00', end: '15:20' },
    { id: 5, start: '15:30', end: '16:50' },
]

let room = $ref('')
let isShowRoom = $ref(false)

let roomList = $ref<any[]>([])
let situation = $ref<any[]>([])

const roomChange = (e: any) => {
    const { picker, value, index } = e.detail
    room = value
}

const selectRoom = async (e: any) => {
    isShowRoom = false
    room = e.detail.value
    const { data: { list } } = await getRoomListApi({ room })
    const array: any[] = []
    list.map(item => {
        if (item.status == '1' || item.status == '2' || item.status == '3') array.push(item)
    })
    situation = array
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
        .content {
            text-align: center;
        }

        .status {
            margin-top: 8px;
            text-align: center;
        }
        .teacher {
            margin-top: 8px;
            text-align: center;
        }
    }
}

:deep(.van-cell-group) {
  margin: 10px;
}

:deep(.van-picker) {
  height: 40vh;
  width: 100vw;
}

</style>