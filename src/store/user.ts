import { defineStore } from 'pinia'

type State = {
  token: string,
  id: string,
  username: string
  permissionList: any[],
  userList: any[],
  likeList: any[],
  fansList: any[]
  avatarUrl: string
  phone: string
  department: string
  specialty: string
}

export const useUserStore = defineStore('user', {
  persist: true,
  state: ():State => ({
    token: '',
    id: '',
    username: '',
    permissionList: [],
    userList: [],
    likeList: [],
    fansList: [],
    avatarUrl: '',
    phone: '',
    department: '',
    specialty: ''
  }),
  actions: {
    async login(user) {
      const { data, success } = await loginApi({
        job: user.job,
        password: user.password,
        openId: user.openId,
        accessToken: user.accessToken,
        isAdmin: 0
      })
      if (success === true) {
        const { list: { username, permission, id, collectList, likeList, avatarUrl, phone, department, specialty }, token, userList, fansList } = data
        this.token = token
        this.username = username
        this.permissionList = permission
        this.userList = userList
        this.id = id
        this.likeList = likeList
        this.fansList = fansList
        this.avatarUrl = avatarUrl
        this.phone = phone
        this.department = department
        this.specialty = specialty
        let promiseList: Promise<any>[] = []
        let noticeList: any[] = []
        uni.setStorageSync('collectList', collectList)
        uni.setStorageSync('id', id)
        uni.setStorageSync('token', token)
        uni.setStorageSync('username', username)
        uni.setStorageSync('likeList', likeList)
        uni.setStorageSync('fansList', fansList)
        uni.setStorageSync('avatarUrl', avatarUrl)
        uni.setStorageSync('sellList', [])
        uni.setStorageSync('phone', phone)
        uni.setStorageSync('department', department)
        uni.setStorageSync('specialty', specialty)
        uni.getStorageSync('collectList').map(async (id: number) => {
          promiseList.push(getNotice({ id }))
        })      
        Promise.all(promiseList).then((res: any) => {
          res.forEach(item => {
            noticeList.push(item.data.list[0])
            uni.setStorageSync("noticeList", noticeList)
          })
        })
        return true
      } else {
        return false
      }
    },
    async modifyUser(flag: boolean, username) {
      const id = uni.getStorageSync('id')
      if (flag == false) {
        let index = this.likeList.findIndex(item => item === username)
        const likeList = [ ...this.likeList ]
        likeList.splice(index, 1)
        await changeUser({ id, likeList })
        this.likeList = likeList
        uni.setStorageSync('likeList', likeList)
      } else {
        const likeList = [ ...this.likeList ]
        likeList.push(username)
        await changeUser({ id, likeList })
        this.likeList = likeList
        uni.setStorageSync('likeList', likeList)
        const sender = uni.getStorageSync('username')
        if (username !== sender) {
          postMessageApi({
            sender: sender,
            recipient: username,
            type: 3
          })
        }
      }
    },
    async editInfo(params = {}) {
      let flag = uni.getStorageSync('id')
      const { success } = await changeUser({ id: flag, ...params })
      if (success) uni.showToast({ icon: 'none', title: '修改成功' })
      else uni.showToast({ icon: 'none', title: '修改失败' })
    }
  },
})
