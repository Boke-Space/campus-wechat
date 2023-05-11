<template>
  <view>
    <view class="header">
      <view>
        <view style="display: flex;">
          <van-image round lazy-load width="3rem" height="3rem" :src="articleDetail.avatarUrl" @click="gotoPerson(articleDetail.username)" />
          <view class="username">
              <view>{{ articleDetail.username }}</view>
              <view>{{ articleDetail.createTime }}</view>
          </view>
        </view>
        <view v-show="articleDetail.isWant && articleDetail.username !== username" @click="handleSell(articleDetail)">
          <van-tag round type="danger" style="position:absolute;right:16px;top:24px" size="large">取消想要</van-tag>
        </view> 
        <view v-show="!articleDetail.isWant && articleDetail.username !== username" @click="handleSell(articleDetail)">
          <van-tag round type="primary" style="position:absolute;right:16px;top:24px" size="large">加入想要</van-tag>
        </view>
      </view>
    </view>


    <view
      style="position: relative"
      v-for="(item, index) of articleDetail.urlList"
    >
      <image
        class="image"
        v-if="index == 0"
        :src="item"
        :tabindex="index"
        @click="previewImg"
      />
      <view class="notice" v-if="index !== 0">{{ index + 1 }} / {{ articleDetail.urlList.length }}</view>
    </view>

    <view style="margin-top: 8px;margin-bottom: 8px;margin-left: 16px;position:relative;padding-bottom: 16px;margin-bottom: 16px;">
      <view style="display: flex;justify-content:space-between;align-items: center;">
        <view>物品名称: {{ articleDetail.title }}</view>
        <view style="margin-right: 16px;">
          <span>价格</span>
          <span style="color:#ee0a40;">￥</span>
          <span style="color:#ee0a40;font-size: 24px;">{{ articleDetail.price }}</span>
        </view>
      </view>
      <view style="padding: 10px 4px">
        <view>{{ articleDetail.content }}</view>
      </view>
    </view>
    
    <van-submit-bar>
      <view style="width: 300px;position:absolute;left:8px;top:8px;">
        <view v-if="articleDetail.destination">地址：{{ articleDetail.destination }}</view>
        <view v-if="articleDetail.phone">电话：{{ phoneSlice(articleDetail.phone) }}</view>
      </view>
      <view>
        <van-image
          v-if="articleDetail.destination"
          style="position: absolute; right: 54px; top: 6px"
          lazy-load
          width="2.5rem"
          height="2.5rem"
          src="../../static/location.png"
          @click="gotoDestination(articleDetail.destination)"
        />
        <van-image
          v-if="articleDetail.phone"
          style="position: absolute; right: 6px; top: 8px"
          lazy-load
          width="2.5rem"
          height="2.5rem"
          src="../../static/phone.png"
          @click="handlePhone(articleDetail.phone)"
          />
      </view>
    </van-submit-bar>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { gotoDestination } from "@/utils/object";

const { username } = $(useLogin())
let articleDetail = $ref<any>({})
let sellList = $ref<any[]>([])

const gotoPerson = (username) => uni.navigateTo({ url: `../Person?username=${username}` })

onLoad(async (options: any) => {
  const item = JSON.parse(options.item)
  articleDetail = item
  sellList = uni.getStorageSync('sellList')
  let index = sellList.findIndex(data => data.id == articleDetail.id)
  if (index == -1) {
    articleDetail.isWant = false
  } else {
    articleDetail.isWant = true
  }
})

const handleSell = (item) => {
  let index = sellList.findIndex(data => data.id == articleDetail.id)
  if (index == -1) {
    articleDetail.isWant = true
    sellList.push(item)
    uni.setStorageSync('sellList', [ ...new Set(sellList) ])
  } else {
    articleDetail.isWant = false
    sellList.splice(index, 1)
    uni.setStorageSync('sellList', [ ...new Set(sellList) ])
  }
}

const previewImg = (e: any) => {
  let index = e.currentTarget.dataset.index
  uni.previewImage({
    current: articleDetail.urlList[index],
    urls: articleDetail.urlList,
  })
}

const handlePhone = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber:phone,
			success:function(e){
			},
  })
}

const phoneSlice = (phone: string) => {
  return phone.substring(0, 3) + '****' + phone.substring(7)
}
</script>

<style lang="less">
.container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 52px;
  display: flex;
  flex-direction: column;

  .comment {
    padding: 10px;
    display: flex;
    align-items: center;

    .content {
      margin-left: 12px;
      flex: 1;
    }
  }

  .subComment {
    padding: 10px;
    display: flex;
    align-items: center;
    margin-left: 32px;

    .content {
      margin-left: 24px;
      flex: 1;
    }
  }

  .wrap {
    white-space: normal;
    width: 310px;
    word-break: break-all;
  }
}

.bottom-textarea {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #f2f2f2;
  padding: 3px 10px;
  display: flex;
  align-items: flex-end;
  .sendComment {
    flex: 1;
    border: 1px solid #efefef;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
  }
  .textarea-container {
    flex: 1;
    box-sizing: border-box;
  }
}

.add-cmt-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  line-height: 64px;
  padding-left: 10px;
  background-color: #1989fa;
  .sendComment {
    flex: 1;
    border: 1px solid #efefef;
    border-radius: 15px;
    height: 42px;
    line-height: 42px;
    font-size: 12px;
    padding-left: 24px;
    margin-left: 10px;
  }
  .icon-box {
    width: 20%;
    display: flex;
    justify-content: space-evenly;
  }
}

.like {
  color: red;
}

.image {
  width: 100vw;
}

.header {
  display: flex;
  margin-left: 16px;
  margin-top: 16px;

  .username {
    margin-left: 16px;
    margin-top: 8px;
  }
}

.notice {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 10px;
  color: #fff;
  text-align: center;
  background-color: #323233;
  border-radius: 50%;
  position: absolute;
  right: 6px;
  top: 8px;
}

.van-submit-bar__button  {
  display: none;
} 
</style>
