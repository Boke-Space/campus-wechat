<template>
  <view>
        <view class="header">
            <van-image round lazy-load width="2.5rem" height="2.5rem" :src="articleDetail.avatarUrl" @click="gotoPerson(articleDetail.username)" />
            <view class="username">
                <view>{{ articleDetail.username }}</view>
            </view>
        </view>

        <view style="position: relative;" v-for="(item, index) of articleDetail.urlList">
          <image class="image" v-if="index == 0" :src="item" :tabindex="index" @click="previewImg" />
          <view class="notice" v-if="index == 0">{{ articleDetail.urlList.length }}</view>
        </view>

        <view style="margin-left: 8px;margin-top: 8px;">
            <view style="font-size: 18px;">{{ articleDetail.title }}</view>
            <view style="margin-top: 8px;">{{ articleDetail.content }}</view>
            <view style="margin-top: 8px;">{{ articleDetail.destination }}</view>
            <view v-if="!articleDetail.updateTime" style="margin-top: 4px;">于 {{ articleDetail.createTime }} 发布</view>
            <view v-else style="margin-top: 4px;">于 {{ articleDetail.updateTime }} 编辑</view>
        </view>
        <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
    </view>

  <view>

    <view class="container" :style="{ 'padding-bottom': `${bottom}px` }">
      <template v-for="comment of commentList" :key="comment.id">
        <view class="comment">
          <van-image round lazy-load width="3rem" height="3rem" :src="comment.avatarUrl" @click="gotoPerson(comment.username)" />
          <view class="content">
            <span>{{ comment.username }}</span>
            <view class="wrap">{{ comment.content }}</view>
            <div style="display:flex; justify-content: space-between">
              <span>{{ comment.createTime }}</span>
              <span style="margin-left: 48px;"><van-icon name="like-o" :class="{ like: comment.isLike }" @click="handleLike(comment)" /> {{comment.count}}</span>
              <span style="margin-right: 16px;"><van-icon name="chat-o"  @click="getComment(comment)" /> {{comment.children.length}}</span>
            </div>
          </view>
        </view>
        <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />

        <van-collapse v-if="comment.children.length !== 0" accordion :value="isCollapse" @change="onChange">
          <van-collapse-item :name="comment.id">
            <view slot="title" style="display: flex;justify-content:space-between">
              <div v-if="isCollapse == '1'" style="margin-left: 48px;">收起剩余评论</div>
              <div v-else style="margin-left: 48px;">展开剩余评论</div>
            </view>
            <template v-for="subComment of comment.children">
              <view class="subComment">
                <van-image round lazy-load width="3rem" height="3rem" :src="subComment.avatarUrl" @click="gotoPerson(comment.username)" />
                <view class="content" @click="reply(subComment, comment.id)">
                  <span v-if="subComment.target === comment.username">
                    <view>{{ subComment.username }}</view>
                    <span>{{ subComment.content }}</span>
                    <div style="display:flex;">
                      <view>{{ subComment.createTime }}</view>
                      <span style="margin-left: 64px;"><van-icon name="like-o" :class="{ like: subComment.isLike }" @click="handleLike(subComment)" /> {{subComment.count}}</span>
                    </div>
                  </span>
                  <span v-else>
                    <view>{{ subComment.username}} <van-icon name="arrow" /> {{subComment.target}}</view>
                    <span>{{ subComment.content }}</span>
                    <div style="display:flex;">
                      <view>{{ subComment.createTime }}</view>
                      <span style="margin-left: 64px"><van-icon name="like-o" :class="{ like: subComment.isLike }" @click="handleLike(subComment)" /> {{subComment.count}}</span>
                    </div>
                  </span>
                </view>
              </view>
              <van-divider customStyle="color: #dcdfe6; border-color: #dcdfe6; font-size: 18px;" />
            </template>
          </van-collapse-item>
        </van-collapse>
      </template>
    </view>

    <view class="add-cmt-box" v-if="isShowCommentBox">
      <van-icon name="arrow-left" />
      <view class="sendComment" @click="handle">说点什么吧</view>
      <view class="icon-box">
        <van-icon name="chat-o" size="24px" :info="commentCount" />
        <van-icon name="star-o" size="24px" :class="{ like: notice?.isCollect }" @click="handleCollect" />
      </view>
    </view> 

    <view class="bottom-textarea" :style="{ bottom: inputBottom + 'px' }" v-else>
      <view class="textarea-container">
        <van-field :value="content" @change="contentChange" @confirm="contentChange" auto-focus="true" placeholder="点赞是喜欢，评论是真爱" 
          type="textarea" autosize center clearable use-button-slot>
          <van-button slot="button" size="small" type="info" round @click="send">发送</van-button>
        </van-field>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { getCommentList, modifyNotice, sendComment, getLikeList, modifyLike, appendLike } from '@/api/comment'
import { changeUser, findUser } from '@/api/user'
import { dateToTime } from '@/utils/time';

const { username } = $(useLogin())
let notice = $ref<any>({})
let commentList = $ref<any>([])
let likeData = $ref<any>([])
let content = $ref('')
let isShowCommentBox = $ref(true)
let form = $ref<any>({})
let isCollapse = $ref('1')
let commentCount = $ref(0)
let inputBottom = $ref(0)
let bottom = $ref(0)
let promiseList: Promise<any>[] = []
let articleDetail = $ref<any>({})
let userInfo = $ref<any>({})

const gotoPerson = (username) => uni.navigateTo({ url: `../components/Person?username=${username}` })

onLoad(async (options: any) => {
  const item = JSON.parse(options.item)
  articleDetail = item
  const res = await getNotice({ id: item.id })
  notice = res.data.list[0]
  notice.collectList.includes(username) ? notice.isCollect = true : notice.isCollect = false
  getList()
})

const previewImg = (e: any) => {
  let index = e.currentTarget.dataset.index
  uni.previewImage({
    current: articleDetail.urlList[index],
    urls: articleDetail.urlList,
  })
}

watch($$(notice), () => notice.collectList.includes(username) ? notice.isCollect = true : notice.isCollect = false)

const contentChange = (event: any) => content = event.detail

const onChange = (e) => isCollapse = e.detail

const getList = async () => {
  let { data } = await findUser({ username })
  userInfo = data.list[0]
  const { data: { list, count } } = await getCommentList(notice.id)
  commentCount = count
  commentList = list.sort((prev, next) => prev.children.length < next.children.length ? 1 : prev.children.length > next.children.length ? -1 : 0)
  getLikeList().then(res => {
    likeData = res.data.list
    commentList.map(comment => {
      comment.count = 0
      comment.isLike = false
      for (const like of likeData) {
        if (comment.id == like.cid) {
          comment.count = like.likeList.length
          if (like.likeList.includes(username)) comment.isLike = true
        }
      }
      comment.children.map(subComment => {
        subComment.count = 0
        subComment.isLike = false
        for (const like of likeData) {
          if (subComment.id == like.cid) {
            subComment.count = like.likeList.length
            if (like.likeList.includes(username)) subComment.isLike = true
          }
        }
      })
    })
  })
}

const handleCollect = async () => {
  let list: any[] = []
  let collectList = uni.getStorageSync('collectList') || []
  if (notice.isCollect == true) {
    let index1 = notice.collectList.findIndex(item => item == username)
    let index2 = collectList.findIndex(item => item == notice.id)
    notice.collectList.splice(index1, 1)
    list = [...new Set(notice.collectList)] 
    collectList.splice(index2, 1)
    collectList = [...new Set(collectList)] 
  } else {
    collectList.unshift(notice.id)
    collectList = [...new Set(collectList) ] 
    notice.collectList.unshift(username)
    list = [...new Set(notice.collectList) ] 
    const params = {
      sender: username,
      recipient: notice.username,
      content: notice.title,
      type: 1
    }
    if (params.recipient !== username) postMessageApi(params)
  }
  const { id } = $(useLogin())
  const { success } = await modifyNotice({ id: notice.id, collectList: list})
  if (success) uni.showToast({ icon: 'none', title: '收藏成功' })
  else uni.showToast({ icon: 'none', title: '收藏失败' })
  const { data } = await getNotice({ id: notice.id })
  notice = data.list[0]
  await changeUser({ id, collectList })
  findUser({ id }).then(res => {
    uni.setStorageSync('collectList', res.data.list[0].collectList)
    let noticeList: any[] = []
    if (uni.getStorageSync('collectList').length === 0) {
      uni.setStorageSync("noticeList", [])
    }
    else {
      uni.getStorageSync('collectList').map(async (id: number) => {
        promiseList.push(getNotice({ id }))
      })      
      Promise.all(promiseList).then((res: any) => {
        res.forEach(item => {
          noticeList.push(item.data.list[0])
          uni.setStorageSync("noticeList", noticeList)
        })
      })
      promiseList = []
    }
  })
}

const handle = () => {
  isShowCommentBox = false
  const params = {
    username: username,
    foreignId: notice.id,
  }
  form = params
}

const getComment = async (item) => {
  isShowCommentBox = false
  const params = {
    avatarUrl: userInfo.avatarUrl,
    createTime: dateToTime(new Date()),
    foreignId: notice.id,
    pid: item.id,
    target: item.username,
    username,
  }
  form = params
}

const reply = async (item, commentId) => {
  isShowCommentBox = false
  const params = {
    avatarUrl: userInfo.avatarUrl,
    createTime: dateToTime(new Date()),
    foreignId: notice.id,
    pid: commentId,
    target: item.username,
    username
  }
  form = params
}

const send = async () => {
  isShowCommentBox = true
  const params = { ...form, content, createTime: dateToTime(new Date()), avatarUrl: userInfo.avatarUrl }
  if (content == '') uni.showToast({ icon: 'none', title: '请输入评论内容' })
  else {
    const { success } = await sendComment(params)
    if (success) uni.showToast({ icon: 'none', title: '评论成功' })
    else uni.showToast({ icon: 'none', title: '评论失败' })
    await getList()
    for (const index in form) {
      form[index] = ''
    }
    content = ''
  }
}

const handleLike = async (item: any) => {
  let { id: cid, isLike, content } = item
  const { data: { list } } = await getLikeList({ cid })
  let likeList = list?.likeList ?? []
  if (list === null) {
    const params = { cid, foreignId: notice.id }
    appendLike(params).then(res => {
      getLikeList({ cid }).then(res => {
        let id = res.data.list.id
        likeList = list?.likeList ?? []
        likeList =  [...new Set(likeList)]
        const params = { ...item, id, likeList }
        likeCallback(params)
      })
    })
  } else {
    const params = { ...item, cid, isLike, likeList, id: list.id, content }
    likeCallback(params)
  }
}

const likeCallback = async (item: any) => {
  let { id, cid, isLike, likeList } = item
  if (isLike == true) {
    let index = likeList.findIndex(item => item == username)
    likeList.splice(index, 1)
    likeList = [...new Set(likeList)] 
    const params = { id, cid, likeList }
    const { success } = await modifyLike(params)
    if (success) uni.showToast({ icon: 'none', title: '点赞成功' })
    else uni.showToast({ icon: 'none', title: '点赞失败' })
    getList()
  } else {
    if (item.username !== username) {
      postMessageApi({
        sender: username,
        recipient: item.username,
        content: item.content,
        type: 2
      })
    }
    likeList.push(username)
    likeList = [...new Set(likeList) ] 
    const params = { id, cid, likeList }
    modifyLike(params)
    const { success } = await modifyLike(params)
    if (success) uni.showToast({ icon: 'none', title: '点赞成功' })
    else uni.showToast({ icon: 'none', title: '点赞失败' })
    getList()
  }
}

function focusTextarea(e) {
  inputBottom = e.detail.height - 64
  bottom = inputBottom + 52
}

function blurTextarea(e) {
  isShowCommentBox = true
  inputBottom = 0
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
    width:30px;
    height:30px;
    line-height:30px;
    font-size:10px;
    color:#fff;
    text-align:center;
    background-color:#323233;
    border-radius:50%;
    position:absolute;
    right:6px;
    top: 8px;
}
</style>
