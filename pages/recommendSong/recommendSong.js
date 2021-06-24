// pages/recommendSong/recommendSong.js
import request from '../../utils/request'
import PubSub from 'pubsub-js'  //引入订阅
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: 1,      //初始化天
    month: 1,   //初始化月份
    musicList:[],   //初始化音乐列表
    index: 0        //点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = new Date()
    // 获取当前的时间
    let getDate = date.getDate()
    let getMonth = date.getMonth() + 1
    this.setData({
      day: getDate,
      month: getMonth
    })
    this.getMusicData()
    // 接受songDetail传来的数据
    PubSub.subscribe('switchType', (msg, data) => {
      // console.log(msg, data)
      let { index, musicList} = this.data
      if (data === 'next' ) {
        index === musicList.length - 1 && (index = -1)
        index = index + 1
      } else if (data === 'pre') {
        index == 0 && (index = musicList.length)
        index = index - 1
      }
      this.setData({
        index
      })
      let currentID = musicList[index].id
      // 传送当前点击的index给songDetail
      PubSub.publish('musicId', currentID)
    })
  },
  // 获取播放音乐的数据
  async getMusicData() {
    let userInfo = wx.getStorageSync('userInfo')
    // 判断用户是否登陆了
    if(!userInfo) {
      wx.showToast({
        title: '请先登录'
      })
      wx.reLaunch({
        url: '/pages/login/login',
      })
    } 
    let musicData = await request('/recommend/songs')
    // console.log(musicData);
    this.setData({
      musicList: musicData.data.recommend
    })
    // console.log(this.data.musicList);
  },
  // 跳转到音乐详情页面
  toDetailSong(event) {
    // console.log(event);
    let song = event.currentTarget.dataset.song
    // 获取当前点击的index
    let index = event.currentTarget.dataset.index
    // console.log(index)
    this.setData({
      index
    })
    wx.navigateTo({
      // 传入query参数
      // 不能直接将song对象作为参数传递，长度过长，会被自动截取掉
      // url: '/pages/songDetail/songDetail?songPackage=' + JSON.stringify(songPackage)
      url: '/pages/songDetail/songDetail?musicId=' + song.id
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