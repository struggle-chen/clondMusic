import config from './config'
export default (url, data={}, method="GET") => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header: {
        // find返回的是字符串,filter返回的是数组
        cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1): ''
      }, 
      success: res => {
        // console.log('请求成功', res)
        // if(data.isLogin) {
        //   // 把cookies值存到本地，为了判断用户是否登录了
        //   wx.setStorageSync('cookies', result.cookies)
        // }
        resolve(res)
      },
      fail: err => {
        // console.log('请求失败', err)
        reject(err)
      }
    })
  })
}
  