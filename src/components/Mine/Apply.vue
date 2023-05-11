<template>
    <view class="content">
        <van-cell-group inset v-for="item of applyList">
        <view style="margin: 5px auto;">
            <van-steps
              :steps="steps"
              :active="item.status"
              active-color="#1F75FE"
            />
            <van-cell style="position: relative;">
                <view>申请课室：{{item.room}}</view>
                <view>预约时段：{{ item.applyDate }} {{item.start}} - {{item.end}}</view>
                <view v-if="item.remark && item.status == 0">失败理由：{{ item.remark }}</view>
                <view>申请时间：{{item.createTime}}</view>
                <van-icon v-if="item.status == 1" style="position:absolute; right: 10px; bottom: 12px" name="delete-o" size="24px" @click="handleDelete(item.id)"/>
                <van-icon v-if="item.status == 0 || item.status == 1" style="position:absolute; right: 40px; bottom: 12px" name="notes-o" size="24px" @click="handleModify(item)" />
            </van-cell>
        </view>
        </van-cell-group>
        <van-toast id="van-toast" />
    </view>
</template>

<script setup lang="ts">
import { onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';

const { username } = $(useLogin())
let applyList = $ref<any[]>([])
let current = $ref(1)
let size = $ref(5)
let count = $ref(0)
let isLoading = $ref(false)

const steps =  [
  {
    desc: '申请失败',
  },
  {
    text: '申请中',
  },
  {
    desc: '审核成功',
  },
  {
    desc: '使用完毕',
  },
]

const getList = async (params = {}) => {
  const { data: { list, total } } = await getRoomListApi({ applicant: username, params })
  applyList = list
  count = total
}

onMounted(() => getList())
onShow(() => getList())

onPullDownRefresh(async () => {
  if (current * size >= count) {
    uni.hideNavigationBarLoading()
    uni.showToast({ title: '暂无更多数据', icon: 'none'})
  } else {
    current++
    getList({current, size})
    uni.showToast({ title: '加载中', icon: 'none'})
  }
  setInterval(() => uni.stopPullDownRefresh(), 100)
})

onReachBottom(async () => {
  if (current * size >= count) {
    isLoading = false
    uni.hideNavigationBarLoading()
    uni.showToast({ title: '暂无更多数据', icon: 'none'})
  } else {
    isLoading = true
    current++
    getList({current, size})
    uni.showToast({ title: '加载中', icon: 'none'})
    isLoading = false
  }
})

const handleModify = (item: any) => uni.navigateTo({ url: '../Mine/ApplyEdit?&item=' + JSON.stringify(item) })

const handleDelete = async (id: number) => {
  const { success } = await deleteRoomListApi(id)
  if (success) uni.showToast({ icon: 'none', title: '删除成功' })
  else uni.showToast({ icon: 'none', title: '删除失败' })
  getList()
}
</script>

<style>
.imgBox {
  font-size: 28rpx;
  margin: 3%;
  background: white;
  padding: 30rpx;
  border-radius: 30rpx;
  display: flex;
  align-items: center;
}

.imgContant {
  margin-left: 40rpx;
}

:deep(.van-cell__value) {
  text-align: left !important;
}

</style>
