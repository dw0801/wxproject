// 同时发送异步代码的次数
let ajaxTimes = 0
export const request = (params) => {
  // 判断 url中是否带有/my/ 有就是私有的 要带上header token
  let header = { ...params.header }
  if (params.url.includes('/my/')) {
    // 拼接header
    header['Authorization'] = wx.getStorageSync('token')
  }

  ajaxTimes++
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  // 定义公共的url
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--
        if (ajaxTimes === 0) wx.hideLoading()
      },
    })
  })
}
