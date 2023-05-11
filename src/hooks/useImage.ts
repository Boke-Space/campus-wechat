export const useImage = (page?: string) => {
  let fileList = $ref<any>([])
  let url = $ref('')
  let color = $ref('')
  let testingInterval = $ref('')
  let testingResult = $ref('')
  let testingTime = $ref('')

  const afterRead = (e: any) => {
    const { file } = e.detail
    let headers = {
      'content-type': 'application/json',
      token: uni.getStorageSync('token') ?? '',
    }
    uni.uploadFile({
      url: `http://localhost:8080/${page}`, // 仅为示例，非真实的接口地址
      filePath: file.url,
      header: headers,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        let result = JSON.parse(res.data)
        if (page === 'health') {
          url = result.data.url,
          color = result.data.list.color,
          testingResult = result.data.list.testingResult,
          testingInterval = result.data.list.testingInterval,
          testingTime = result.data.list.testingTime
        }
        fileList.push(result.data.url)
      }
    })
  }

  const previewImg = (e) => {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index
    //所有图片
    uni.previewImage({
      //当前显示图片
      current: fileList[index],
      //所有图片
      urls: fileList,
    })
  }

  const deleteImg = (e) => {
    var index = e.currentTarget.dataset.index
    fileList.splice(index, 1)
  }

  return $$({ fileList, url, color, testingResult, testingInterval, testingTime, afterRead, previewImg, deleteImg })
}
