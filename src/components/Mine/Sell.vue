<template>
    <view class="Index">
        <view class="pubuBox">
            <view class="pubuItem">
                <view class="item-masonry" v-for="(item, index) of noticeList" :key="index">
                    <image :src="item.urlList[0]" mode="widthFix" @click="gotoDetail(item)"></image>
                    <view class="listtitle">
                        <!-- 这是没有高度的父盒子（下半部分） -->
                        <view class="listtitle1">{{ item.title }}</view>
                        <view style="display: flex; margin-top: 8px; position: relative">
                            <van-image round lazy-load width="2rem" height="2rem" :src="avatarUrl"
                                @click="gotoPerson(item.username)" />
                            <view class="username">{{ item.username }}</view>
                            <van-icon style="position: absolute; right: 10px; bottom: 4px" name="delete-o" size="24px"
                                @click="handleDelete(item.id)" />
                            <van-icon style="position: absolute; right: 40px; bottom: 4px" name="notes-o" size="24px"
                                @click="handleModify(item)" />
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
  
<script setup lang="ts">
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'

const { username, avatarUrl } = $(useLogin())
let noticeList = $ref<any>([])

let current = $ref(1)
let size = $ref(10)
let count = $ref(0)
let isLoading = $ref(false)

const getList = async (params = {}) => {
    const { data: { list, total } } = await getArticleApi({ type: 2, username, ...params })
    noticeList = list
    count = total
}

onMounted(() => getList())

onPullDownRefresh(async () => {
    if (current * size >= count) {
        uni.hideNavigationBarLoading()
        uni.showToast({ title: '暂无更多数据', icon: 'none' })
    } else {
        current++
        getList({ current, size })
        uni.showToast({ title: '加载中', icon: 'none' })
    }
    setInterval(() => uni.stopPullDownRefresh(), 100)
})

onReachBottom(async () => {
    if (current * size >= count) {
        isLoading = false
        uni.hideNavigationBarLoading()
        uni.showToast({ title: '暂无更多数据', icon: 'none' })
    } else {
        isLoading = true
        current++
        getList({ current, size })
        uni.showToast({ title: '加载中', icon: 'none' })
        isLoading = false
    }
})

const gotoDetail = (item) => {
    uni.navigateTo({ url: `/components/Discover/SellDetail?item=${JSON.stringify(item)}` })
}

const handleModify = (item: any) => uni.navigateTo({ url: '/components/Mine/ArticleEdit?type=2&item=' + JSON.stringify(item) })

const handleDelete = async (id: number) => {
    const { success } = await deleteArticleApi(id)
    if (success) uni.showToast({ icon: 'none', title: '删除成功' })
    else uni.showToast({ icon: 'none', title: '删除失败' })
    const { data: { list } } = await getArticleApi({ type: 2, username })
    noticeList = list
}

const gotoPerson = (username) =>
    uni.navigateTo({ url: `../Person?username=${username}` })
</script>
  
<style scoped lang="less">
:deep(.van-cell-group) {
    margin: 10px;
}

:deep(.van-swipe-cell__right) {
    display: inline-block;
    font-size: 15px;
    color: #fff;
    text-align: center;
    background-color: #f44;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-pack: center;
    -webkit-box-align: center;
}

page {
    background-color: #eee;
    height: 100%;
}

.pubuBox {
    padding: 22rpx;
}

.pubuItem {
    column-count: 2;
    column-gap: 20rpx;
}

.item-masonry {
    box-sizing: border-box;
    border-radius: 15rpx;
    overflow: hidden;
    background-color: #fff;
    break-inside: avoid;
    /*避免在元素内部插入分页符*/
    box-sizing: border-box;
    margin-bottom: 20rpx;
    box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);
}

.item-masonry image {
    width: 100%;
}

.listtitle {
    padding-left: 22rpx;
    font-size: 24rpx;
    padding-bottom: 22rpx;

    .listtitle1 {
        line-height: 39rpx;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        min-height: 39rpx;
        max-height: 78rpx;
        font-size: 15px;
    }

    .listtitle2 {
        color: #ff0000;
        font-size: 32rpx;
        line-height: 32rpx;
        font-weight: bold;
        padding-top: 22rpx;

        .listtitle2son {
            font-size: 32rpx;
        }
    }

    .listtitle3 {
        font-size: 28rpx;
        color: #909399;
        line-height: 32rpx;
        margin-top: 4px;
    }
}

.Index {
    width: 100%;
    height: 100%;
}

.username {
    margin-left: 8px;
    margin-top: 8px;
}
</style>
  