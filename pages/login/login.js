// pages/login/login.js
/**
  作者: Created by zhiyongzaixian
  说明: 登录流程
  1. 收集表单项数据
  2. 前端验证
    1) 验证用户信息(账号，密码)是否合法
    2) 前端验证不通过就提示用户，不需要发请求给后端
    3) 前端验证通过了，发请求(携带账号, 密码)给服务器端
  3. 后端验证
    1) 验证用户是否存在
    2) 用户不存在直接返回，告诉前端用户不存在
    3) 用户存在需要验证密码是否正确
    4) 密码不正确返回给前端提示密码不正确
    5) 密码正确返回给前端数据，提示用户登录成功(会携带用户的相关信息)
*/
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: 0,
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 收集表单数据
  handleInput(event) {
  //  console.log(event)
  let type = event.currentTarget.dataset.type
  // console.log(type)
  this.setData({
    [type]: event.detail.value
  })
  },
  async login() {
    let {phone, password} = this.data
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    // 验证手机格式是否正确
    let regex = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
    if (!regex.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    // 验证密码是否正确
    if(!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }
    // 后端验证
    let result = await request('/login/cellphone', {phone, password, isLogin: true})
    console.log(result)
    if(result.data.code === 200) {
      // 把数据存储到本地
      wx.setStorageSync('userInfo',JSON.stringify(result.data.profile))
      // 把cookies值存到本地，为了判断用户是否登录了
      wx.setStorageSync('cookies', result.cookies)
      wx.showToast({
        title: '登陆成功'
      })
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if (result.data.code === 400) {
      wx.showToast({
        title: '手机格式不正确',
        icon: 'none'
      })
      return
    }else if(result.data.code === 502) {
      wx.showToast({
        title: '密码输入错误',
        icon: 'none'
      })
      return
    } else{
      wx.showToast({
        title: '登陆失败,请重新登录',
        icon: 'none'
      })
      return
    }
  
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