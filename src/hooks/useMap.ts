import { onShow, onUnload } from '@dcloudio/uni-app';
import  QQMapWX from "../utils/qqmap-wx-jssdk.min"

export const useMap = () => {
  let latitude = $ref(0)
  let longitude = $ref(0)
  let destination = $ref('')
  
  const chooseLocation = requirePlugin('chooseLocation');

  function selectDestination() {
    uni.getLocation({
        type: 'wgs84',
        success: (res) => {
          latitude = res.latitude
          longitude = res.longitude
          const key = 'BEKBZ-SP6W2-IQ5U3-CF6QM-THQHS-6SFPN' //使用在腾讯位置服务申请的key
          const referer = 'Campus' //调用插件的app的名称
          const location = JSON.stringify({ latitude, longitude })
          const category = '生活服务,娱乐休闲'
          wx.navigateTo({
            url:  
              'plugin://chooseLocation/index?key=' +
              key +
              '&referer=' +
              referer +
              '&location=' +
              location +
              '&category=' +
              category,
          })
        },
      })
  }

  function getLocation() {
    // 向用户发起授权请求，弹框提示
    uni.authorize({
      // 获取用户定位信息
      scope: 'scope.userLocation',
      // 用户同意授权执行
      success() {
        let qqmapsdk = new QQMapWX({ key: 'BEKBZ-SP6W2-IQ5U3-CF6QM-THQHS-6SFPN' })
        //获取位置信息
        uni.getLocation({
          type: 'gcj02',
          success: function (res) {
            // 逆地址解析方法
            qqmapsdk.reverseGeocoder({
              location: {
                latitude: res.latitude,
                longitude: res.longitude,
              },
              success(res) {
                destination.value = res.result.address
              },
            })
          },
        })
      },
      // 若用户不同意授权，弹框提示
      fail(res) {
        uni.showToast({
          icon: 'none',
          title: '注意：需要获取您的定位授权,否则部分功能将无法使用',
          duration: 2000,
        })
      },
    })
  }

  onShow(() => destination = chooseLocation.getLocation()?.name ?? '')
  onUnload(() => chooseLocation.setLocation(null))

  return $$({ destination, selectDestination, getLocation })
}
