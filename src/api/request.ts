// export const baseURL = '192.168.68.122:8080'
// export const baseURL = '172.20.10.2:8080'
export const baseURL = 'localhost:8080'

export type Result<T = any> = { 
  success: number
  code: string
  message: string
  data: T
}

function request<T>(
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
): Promise<T> {
  return new Promise(function (resolve, reject) {
    let header = {
      'content-type': 'application/json',
      token : uni.getStorageSync('token') ?? ''
    }
    uni.request({
      url: `http://${baseURL}${url}`,
      withCredentials: true,
      method,
      data,
      header,
      success(res: any) {
        resolve(res.data)
      },
      // fail(err) {
      //   //请求失败
      //   uni.showToast({
      //     title: '无法连接到服务器',
      //     icon: 'none',
      //   })
      //   reject(err)
      // },
    })
  })
}

export { request }
