

export function objectValueAllEmpty(object: any) {
  let isEmpty = true
  Object.keys(object).forEach(function (x) {
    if (object[x] == null && object[x] == ''  && object[x] == undefined) {
      return isEmpty
    } else {
      isEmpty = false
    }
  })
  return isEmpty
}

export async function gotoDestination(address) {
  uni.request({
    url: 'https://apis.map.qq.com/ws/geocoder/v1/',
    data: {
      key: 'BEKBZ-SP6W2-IQ5U3-CF6QM-THQHS-6SFPN',
      address,
    },
    success: (res: any) => {
      location = res.data.result.location
       uni.openLocation({
        latitude: location.lat,
        longitude: location.lng,
        name: address,
        scale: 28,
        success: function() {
        }
      });
    }
  })
      // latitude = res.latitude
      // longitude = res.longitude
      // let endPoint = JSON.stringify({ 
      //   name: destination,
      //   latitude,
      //   longitude
      // })
      // wx.navigateTo({
      //   url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
      // });
      // uni.openLocation({
      //   latitude,
      //   longitude,
      //   name: destination,
      //   // 缩放大小
      //   scale: 28,
      //   success: function() {
      //     console.log('成功的回调success');
      //   }
      // });
}
