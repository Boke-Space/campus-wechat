<template>
  <view>
    <view class="header">
      <view style="display: flex;">
          <van-image round lazy-load width="3rem" height="3rem"  />
          <view class="username">
              <view>{{ articleDetail.department }}</view>
              <view>{{ articleDetail.createTime }}</view>
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
      <view class="notice" v-if="index == 0">{{
        articleDetail.urlList.length
      }}</view>
    </view>

    <view style="margin-left: 8px; margin-top: 8px">
      <view style="font-size: 18px">{{ articleDetail.title }}</view>
      <view style="margin-top: 8px">{{ articleDetail.content }}</view>
      <view style="margin-top: 8px">{{ articleDetail.destination }}</view>
      <view v-if="!articleDetail.updateTime" style="margin-top: 4px"
        >于 {{ articleDetail.createTime }} 发布</view
      >
      <view v-else style="margin-top: 4px"
        >于 {{ articleDetail.updateTime }} 编辑</view
      >
    </view>
    <van-divider
      customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;"
    />
  </view>

</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'

let articleDetail = $ref<any>({})

const gotoPerson = (username) => uni.navigateTo({ url: `../components/Person?username=${username}` })

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
</style>
