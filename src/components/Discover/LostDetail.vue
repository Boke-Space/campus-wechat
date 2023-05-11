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
        <van-tag v-if="articleDetail.isLost == 0" round type="primary" style="position:absolute;right:16px;top:24px" size="large">捡到物品</van-tag>
        <van-tag v-if="articleDetail.isLost == 1" round type="danger" style="position:absolute;right:16px;top:24px" size="large">丢失物品</van-tag>
      </view>
    </view>

    <view style="padding: 0 10px;">
      <view
        style="position: relative;margin-top: 16px;"
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
    </view>

    <view style="margin-top: 8px;margin-bottom: 8px;margin-left: 16px;position:relative;padding-bottom: 16px;margin-bottom: 16px;">
      <view v-if="articleDetail.isLost == 0">
          <view v-if="articleDetail.title">捡到物品：{{ articleDetail.title }}</view>
          <view v-if="articleDetail.address">捡到地点：{{ articleDetail.address }}</view>
          <view v-if="articleDetail.time">捡到时间：{{ articleDetail.time }}</view>
      </view>
      <view v-if="articleDetail.isLost == 1">
          <view v-if="articleDetail.title">丢失物品：{{ articleDetail.title }}</view>
          <view v-if="articleDetail.address">丢失地点：{{ articleDetail.address }}</view>
          <view v-if="articleDetail.time">丢失时间：{{ articleDetail.time }}</view>
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

let articleDetail = $ref<any>({})

const gotoPerson = (username) =>uni.navigateTo({ url: `../Person?username=${username}` })

onLoad(async (options: any) => {
  const item = JSON.parse(options.item)
  articleDetail = item
})

const previewImg = (e: any) => {
  let index = e.currentTarget.dataset.index
  uni.previewImage({
    current: articleDetail.urlList[index],
    urls: articleDetail.urlList,
  })
}

const handlePhone = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone,
    success: function (e) {
      
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
  width: 95vw;
}

.header {
  display: flex;
  margin-left: 16px;
  margin-top: 16px;

  .username {
    margin-left: 16px;
    margin-top: 4px;
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
