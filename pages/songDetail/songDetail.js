// pages/songDetail/songDetail.js
import PubSub from 'pubsub-js'  //引入订阅 两个页面之间产生联系
import moment from 'moment'    //引入第三方库，转变时间格式

import request from '../../utils/request'
// 创建控制全局变量的实例
let appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,  //记录是否普播放
    musicId: 0,      //音乐的Id
    musicList: {},     //初始化音乐详情数据
    musicLink: '',
    duration: '' ,       //总时长
    currentTime: '00:00',       //当前播放时间
    currentWidth: 0      //播放的进度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options: 用于接收路由跳转的query参数
    // 原生小程序中路由传参，对参数的长度有限制，如果参数长度过长会自动截取掉
    // console.log(options);
    let musicId = options.musicId
    this.setData({
      musicId
    })
    // 获取音乐的详情数据
    this.getsongDetailData(this.data.musicId)
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })     
    } 
    // 创建控制背景音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlay(true)
      
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlay(false)
      
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlay(false) 
    })
    // 监听音频实时进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      // console.log('实时进度:', this.backgroundAudioManager.currentTime);
      // console.log('总时长:',this.backgroundAudioManager.duration);
      let dt = this.backgroundAudioManager.duration * 1000
      let ct = this.backgroundAudioManager.currentTime * 1000
      // console.log(appInstance.globalData.musicId);
      // console.log(musicId);
      if(appInstance.globalData.musicId === musicId) {
        let currentTime = moment(ct).format('mm:ss')
        let currentWidth = (500 * ct) / dt
        this.setData({
          currentTime,
          currentWidth
        })
      }     
    })
    // 监听音频加载完
    this.backgroundAudioManager.onEnded(() => {
      // 发送信息给recommend页面
      PubSub.publish('switchType', 'next')
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })

    })
  },
  //修改播放状态的功能函数
  changePlay(isPlay) {
    this.setData({
      isPlay
    })
     // 修改全局音乐播放的状态
    appInstance.globalData.isMusicPlay = isPlay
  },
  // 点击播放按钮用户是否播放
  isPlay() {
    let isPlay = !this.data.isPlay
    let { musicId, musicLink} = this.data
    this.musicControl(musicId, isPlay, musicLink)
  },
  // 获取音乐的详情数据
  async getsongDetailData(musicId) {
    let musicData = await request('/song/detail', {ids: musicId})
    // console.log(musicData.data.songs);
    // 获取音乐的总时长
    let dt =  musicData.data.songs[0].dt   //毫秒
    let duration = moment(dt).format('mm:ss')
    // console.log(duration);
    this.setData({
      musicList: musicData.data.songs,
      duration
    })
    // 动态修改标题
    wx.setNavigationBarTitle({
      title: this.data.musicList[0].name
    })
  },
  // 监听控制音乐是否播放
  async musicControl(musicId, isPlay, musicLink) {
    // 如果音乐播放
    if(isPlay) {
      // 避免播放一首歌时,多次发送请求
      if (!musicLink) {
        let songUrl = await request('/song/url', { id: musicId })
        // console.log(songUrl)
        musicLink = songUrl.data.data[0].url
        this.setData({
          musicLink 
        })      
      }     
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.musicList[0].name
    } else {
      this.backgroundAudioManager.pause()
    }

  },
  // 监听切换歌曲
  switchType(event) {
    // console.log(event.currentTarget.id)
    let type = event.currentTarget.id
    // 关闭当前音乐
    this.backgroundAudioManager.stop()
    
    // 接受recommend传送过来的id
    PubSub.subscribe('musicId', (msg, data) => {
      // console.log(data)
      // 获取音乐的详情数据
      this.getsongDetailData(data)
      // 切换后让音乐自动播放
      this.musicControl(data, true)
      // 取消订阅
      PubSub.unsubscribe()
    })
    // 发送信息给recommend页面
    PubSub.publish('switchType', type)
  
  },
  // 点击任何位置是音乐到达指定位置
  handleCurrentTime(event) {
    console.log(event);
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