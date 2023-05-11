<template>
  <view class="tab_nav">
    <view class="navTitle" v-for="(item,index) in navList">
      <view :class="{ 'active' : category == item.title }" @click="onChange(item.title)">
        {{item.title}}
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
</template>

<script setup lang="ts">
import { onLoad, onPullDownRefresh, onReachBottom, onShow } from '@dcloudio/uni-app'

let navList = $ref([
  {
    index: 0,
    title: "全部"
	},
  {
    index: 1,
    title: "服饰鞋帽"
	},{
    index: 2,
    title: "书籍资料"
  },{
    index: 3,
    title: "生活用品"
	},{
    index: 4,
    title: "数码电器"
	}
])

let category = $ref('服饰鞋帽')
let lostList = $ref<any[]>([])
let urlList = $ref<any[]>([])
let avatarUrlList = $ref<any[]>([])
const promiseList: Promise<any>[] = []
let current = $ref(1)
let size = $ref(2)
let count = $ref(0)
let isLoading = $ref(false)

const onChange = (index) => {
  if (index === '全部') {
    category = index
    getList({ category: '' })
  }
  else {
    category = index
    getList({ category })
  }
}

onLoad((options: any) => {
  category = options.item
  getList({ category })
})

const getList = async (params = {}) => {
    const { data: { list, total } } = await getArticleApi({ type: 2, status: 0, ...params })
    lostList = list
    count = total
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
  uni.navigateTo({ url: `/components/Discover/SellDetail?item=${JSON.stringify(item)}`  })
}

const gotoPerson = (username) => uni.navigateTo({ url: `/components/Person?username=${username}` })
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

.tab_nav{
	display: flex;
	justify-content: center;
	align-items: center;
}
.tab_nav  .navTitle {
	height: 90rpx;
	line-height: 90rpx;
	width: 100%;
	text-align: center;
	font-size: 32rpx;
	font-family: Alibaba PuHuiTi;
	color: #333;
}
.active {
	position: relative;
	color: #1F75FE;
}
.active::after {
	content: "";
	position: absolute;
	width: 100rpx;
	height: 4rpx;
	background-color: #1F75FE;
	left: 0px;
	right: 0px;
	bottom: 0px;
	margin: auto;
}
</style>
