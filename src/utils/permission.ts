export const useRouterInterceptor = () => {
  //设置可以放行的路由白名单
  const whiteList = ['/', '../pages/Login']
  //设置路由拦截的操作
  const arr = ['navigateTo', 'redirectTo', 'switchTab']
  arr.forEach((item) => {
    uni.addInterceptor(item, {
      invoke(args) {
        let url = args.url
        if (url && url.indexOf('?') != -1) {
          url = url.split('?')[0]
        }
        if (whiteList.some((item) => item === url)) return
        let token = uni.getStorageSync('token')
        if (token) return
        uni.showToast({
          title: '请先登录',
        })
        uni.navigateTo({
          url: '../pages/Login',
        })
        return false
      },
    })
  })
}
