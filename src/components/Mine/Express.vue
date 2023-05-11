<template>
    <view v-for="(item, index) of lostList" :key="index">
        <view style="border-radius: 16px;background-color: #f7f8fa;margin: 0 10px">
            <view style="display:flex;margin-top: 8px;margin-left: 16px;position:relative">             
                <view style="padding-top: 16px;display:flex" @click="gotoDetail(item)">
                    <van-image round lazy-load width="3rem" height="3rem" :src="avatarUrl" />
                    <view class="username">
                        <view>{{ item.username }}</view>
                        <view>{{ item.createTime }}</view>
                    </view>
                </view>
                <view v-if="item.status == '0'" @click="handleExpress(item)">
                    <van-tag round type="primary" style="position:absolute;right:16px;top:24px;" size="large">无人接单</van-tag>
                </view>
                <view v-if="item.status == '1'" @click="handleExpress(item)">
                    <van-tag round type="primary" style="position:absolute;right:16px;top:24px;" size="large">配送中</van-tag>
                </view>
                <view v-if="item.status == '2'" @click="handleExpress(item)">
                    <van-tag round type="primary" style="position:absolute;right:16px;top:24px;" size="large">已完成</van-tag>
                </view>
            </view>
            <view style="margin-top: 8px;margin-bottom: 8px;margin-left: 16px;position:relative;padding-bottom: 16px;margin-bottom: 16px;">
                <view style="display: flex">
                    <van-icon name="location-o" size="32px" />
                    <view style="margin-left: 16px;flex:1">
                        <view>
                            <span>{{ item.destination }}</span>
                            <span style="color:#388cea">{{ item.address }}</span>
                        </view>
                        <view>
                            <span>{{ username }}</span>
                            <span style="color:#388cea;margin-left: 16px;">{{ item.phone }}</span>
                        </view>
                    </view>
                </view>
                <view style="margin-top: 16px;">
                    <view v-if="item.receiver" style="margin-bottom:8px;margin-left: 8px;">配送人: {{ item.receiver }}</view>
                    <view style="margin-bottom:8px;margin-left: 8px;">代取商品类型: {{ item.category }}</view>
                    <view style="margin-bottom:8px;margin-left: 8px;">代取商品数量: {{ item.num }}</view>
                    <view style="margin-bottom:8px;margin-left: 8px;">代取商品名称: {{ item.title }}</view>
                    <van-icon style="position:absolute; right: 10px; top: 80px" name="delete-o" size="36px" @click="handleDelete(item.id)"/>
                    <van-icon v-if="item.status == '0'" style="position:absolute; right: 10px; top: 112px" name="notes-o" size="36px" @click="handleModify(item)" />
                </view>
                <view style="margin-top: 16px;display:flex;justify-content:space-between;align-items: center;">
                    <view style="margin-left: -8px;margin-top: 8px;">
                        <span style="color:#388cea">期望送达时间：</span>
                        <span style="margin-left: 8px;">{{ item.time }}</span>
                    </view>
                    <view style="margin-right: 16px;">
                        <span>价格</span>
                        <span style="color:#ee0a40;">￥</span>
                        <span style="color:#ee0a40;font-size: 24px;">{{ item.price }}</span>
                    </view>
                </view>
            </view>
        </view> 
    </view>
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app';
import Move from "@/components/Move.vue";

const { username, phone, avatarUrl } = $(useLogin())
let lostList = $ref<any[]>([])
let urlList = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []
let current = $ref(1)
let size = $ref(10)
let count = $ref(0)
let isLoading = $ref(false)

const getList = async (params: any = {}) => {
    const { data: { list, total } } = await getArticleApi({ type: 3, username, ...params })
    lostList = list
    urlList = list.map(item => item.urlList)[0]
    list.map((item: any) => promiseList.push(findUser({ username: item.username })))
    Promise.all(promiseList).then((res: any) => {
        res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
        lostList.forEach(item => {
            avatarUrlList.map(subItem => {
                item.avatarUrl = subItem
            })
        })
    })
}

onMounted(() => getList())
onShow(() => getList())

const handleExpress = async (item) => {
    const { data: { openId, accessToken} } = await openIdApi({ username: item.username })
    const { errmsg } = await subscribeExpress({
        openId, accessToken, username, phone,
        status: '已接单',
        address: item.destination + item.address,
        num: `${item.num}件货品`,
    })
    const { success } = await modifyArticleApi({ id: item.id, status: 1, contact: phone })
    if (success && errmsg == 'ok') {
        uni.showToast({ icon: 'none', title: '接单成功' })
        await getList()
    } 
    else uni.showToast({ icon: 'none', title: '接单失败' })
}

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

const previewImg = (e) => {
    let index = e.currentTarget.dataset.index
    uni.previewImage({
        current: urlList[index],
        urls: urlList,
    })
}

const handleModify = (item: any) => uni.navigateTo({ url: '/components/Mine/ArticleEdit?type=3&item=' + JSON.stringify(item) })

const handleDelete = async (id: number) => {
  const { success } = await deleteArticleApi(id)
  if (success) uni.showToast({ icon: 'none', title: '删除成功' })
  else uni.showToast({ icon: 'none', title: '删除失败' })
  const { data: { list } } = await getArticleApi({ type: 3, username })
  lostList = list
}

const gotoDetail = (item) => uni.navigateTo({ url: `/components/Discover/ExpressDetail?item=${JSON.stringify(item)}` })

const handleMove = () => uni.navigateTo({ url: `/components/Discover/ExpressAppend` })
</script>

<style scoped lang="less">
.username {
  margin-left: 16px;
  padding-top: 4px;
}

.imageInfo {
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

.imageHeight {
    height: 200px !important;
}
</style>