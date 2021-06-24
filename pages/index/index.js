// pages/index/index.js
import request from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList: [],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (options) {
    // 获取轮播图的数据
    request('/banner', {type: 2}).then(res => {
      // console.log(res);
      // 修改数据
      this.setData({
        bannerList: res.data.banners
      })
    })
    // 获取推荐歌单数据
    request('/personalized', {limit: 10}).then(res => {
      // console.log(res);
      this.setData({
        recommendList: res.data.result
      })
    })
    // 获取排行榜数据
    let idx = 0
    let arrRustle = []
    while(idx < 5) {
      request('/top/list', {idx: idx++}).then(res => {
        // console.log(res);
        // splice(会修改原数组，可以对指定的数组进行增删改) slice(不会修改原数组)
        let topItem = {
          name: res.data.playlist.name,
          tracks: res.data.playlist.tracks.slice(0, 3)
        }  
        // console.log(topItem);    
        arrRustle.push(topItem)
        // console.log(arrRustle);
        this.setData ({
          topList: arrRustle
        })
      })
    }
  },
  // 跳转到每日推荐页面
  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
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