// 获取access_token
export function getAccessToken() {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        appid: 'wx7c8cb16a1beecb81',
        secret: 'cc140d91e9c3f4a91673341da445100b',
        grant_type: 'client_credential',
      },
      success: (res) => {
        resolve(res.data.access_token)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

export function getJsCode() {
  return new Promise((resolve, reject) => {
    uni.login({
      success(res) {
        resolve(res.code)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

export function getOpenId(js_code: string) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `https://api.weixin.qq.com/sns/jscode2session`,
      data: {
        appid: 'wx7c8cb16a1beecb81',
        secret: 'cc140d91e9c3f4a91673341da445100b',
        grant_type: 'authorization_code',
        js_code,
      },
      success: (res) => {
        resolve(res.data.openid)
      },
      fail(err) {
        reject(err)
      },
    })
  })
}
