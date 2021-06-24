// pages/personal/personal.js
import request from '../../utils/request.js'
let startY = 0  //手指开始的坐标
let moveY = 0   //手指移动完的坐标
let distance = 0 //移动的距离

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    loginList: {},
    playRecord: [] //最近播放记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) { 
    // 读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(JSON.parse(userInfo))
    if(userInfo) {
      this.setData({
        loginList: JSON.parse(userInfo)
      })
      let playerRecord = await request('/user/record', { uid: JSON.parse(userInfo).userId, type: 0 })
      // console.log(playerRecord)
      // let index = 0
      this.setData({
        playerRecord: playerRecord.data.allData.splice(0, 10)
      })
    }
   
  },
  // 处理个人主页中的动画效果
  handleTouchStart(event) {
    // console.log(event);
    this.setData({
      coverTransform: '',
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },
  handleMove(event) {
    moveY = event.touches[0].clientY
    distance = moveY - startY
    if(distance < 0) {
      this.setData({
        coverTransform: `translateY(0rpx)`
      })
      return 
    }
    if(distance > 80) {
      this.setData({
        coverTransform: `translateY(80rpx)`
      })
      return
    }
    this.setData({
      coverTransform: `translateY(${distance}rpx)`
    })
  },
  handleTouchEnd() {
    distance = moveY - startY
    this.setData({
      coverTransform: `translateY(0rpx)`,
      // 过度时间1s,匀速运动
      coverTransition: '1s linear'
    })
  },
  // 跳转到登录页面
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})