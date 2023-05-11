<template>
    <view style="padding: 10px">
        <van-search
            :value="title"
            shape="round"
            @search="handleSearch"
            placeholder="搜索你想要的物品"
        />
        <view>
            <image src="../../static/market1.jpg" style="width: 100%;height:200px" />
        </view>
        <view style="display: flex;justify-content: space-between;align-items: center;margin-top: 16px;flex-wrap: wrap;">
            <view style="position:relative;height:80px;width:23vw;"  @click="gotoSell('服饰鞋帽')">
                <image src="../../static/cloth.png" class="icon" />
                <view class="content">服饰鞋帽</view>
            </view>
            <view style="position:relative;height:80px;width:23vw;">
                <image src="../../static/book.png" class="icon" @click="gotoSell('书籍资料')" />
                <view class="content">书籍资料</view>
            </view>
            <view style="position:relative;height:80px;width:23vw;">
                <image src="../../static/tissue.png" class="icon" @click="gotoSell('生活用品')" />
                <view class="content">生活用品</view>
            </view>
            <view style="position:relative;height:80px;width:23vw;">
                <image src="../../static/computer.png" class="icon" @click="gotoSell('数码电器')" />
                <view class="content">数码电器</view>
            </view>
        </view>
    </view>
    <view class="Index">
        <view class="pubuBox">
            <view class="pubuItem">
                <view
                    class="item-masonry"
                    v-for="(item, index) of lostList"
                    :key="index"
                >
                <image :src="item.urlList[0]" mode="widthFix" @click="gotoDetail(item)"></image>
                <view class="listtitle">
                    <!-- 这是没有高度的父盒子（下半部分） -->
                    <view class="listtitle1">{{ item.title }}</view>
                    <view style="display:flex;margin-top: 8px;position:relative">             
                    <van-image round lazy-load width="2rem" height="2rem" :src="item.avatarUrl" @click="gotoPerson(item.username)" />
                    <view class="username">{{ item.username }}</view>
                      <view style="position: absolute;right:15px;top:6px;font-size: 17px;color:#c83d3d">￥ {{ item.price }}</view>
                    </view>
                </view>
                </view>
            </view>
        </view>
    </view>
    <Move>
      <image style="width:60px;height:60px" src="../../static/add.png" mode="widthFix" @click="handleMove" />
    </Move>
</template>

<script setup lang="ts">
import Move from "@/components/Move.vue";
import { onShow } from "@dcloudio/uni-app";

let title = $ref('')
let lostList = $ref<any[]>([])
let urlList = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []
let current = $ref(1)
let size = $ref(2)
let count = $ref(0)
let isLoading = $ref(false)

const getList = async (params: any = {}) => {
    const { data: { list, total } } = await getArticleApi({ type: 2, status: 0, ...params })
    lostList = list
    count = total
    urlList = list.map(item => item.urlList)[0]
    list.map((item: any) => promiseList.push(findUser({ username: item.username })))
    Promise.all(promiseList).then((res: any) => {
        res.forEach(item => avatarUrlList.push(item.data.list[0].avatarUrl))
        lostList.forEach((item, index) => {
            item.avatarUrl = avatarUrlList[index]
        })
    })
}

const handleSearch = (e) => getList({ title: e.detail })

const gotoDetail = (item) => {
  uni.navigateTo({ url: `/components/Discover/SellDetail?item=${JSON.stringify(item)}`  })
}

const gotoPerson = (username) => uni.navigateTo({ url: `../components/Person?username=${username}` })

const gotoSell = (item) => uni.navigateTo({ url: `/components/Discover/SellList?item=${item}` })

const handleMove = () => uni.navigateTo({ url: `/components/Discover/SellAppend` })

onShow(() => getList())
onMounted(() => getList())
</script>

<style scoped lang="less">
.icon {
    width: 32px;
    height: 32px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}

.content {
    position: absolute;
    left: 18px;
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
  margin-top: -32px;
}

.username {
  margin-left: 8px;
  margin-top: 8px;
}
</style>