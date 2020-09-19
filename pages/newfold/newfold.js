// pages/newfold/newfold.js
const app = getApp();
const db = wx.cloud.database()
const file = db.collection('file')
const userList = db.collection('user')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id==null){
      wx.showLoading({
        title: '用户未授权..',
      })
      console.log("用户openid为空")
      wx.reLaunch({
        url: '../login/login',
      })
    }
    
        userList.where({
          _openid: options.id
        }).count().then(res =>{
          if(res.total==0){
            console.log("用户未注册" + options.id)
            wx.showLoading({
              title: '用户未注册..',
            })
            wx.reLaunch({
              url: '../login/login',
            })
          }
        })

        this.setData({
          _openid: options.id
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

  },

  name:function(event){
    this.setData({
      input: event.detail.value
    })
  },

  newfold:function(event){
    if(this.data.input==null){
      wx.showToast({
        title: '名字不能为空',
      })
      return
    }

    wx.showLoading({
      title: '上传中.....',
    })
    // 将图片上传至云存储空间
        var typelink="http://m.qpic.cn/psc?/V129kKld2rbPxR/ruAMsa53pVQWN7FLK88i5j.H.TQm2.Baoo3ooINKmmA0ZyKeqPlQJmXJfTrL2lppuxoDLioYI7fnUicRQyxB7uzXuoicVOQP*9nzvtZYKH0!/b&bo=wADAAAAAAAADByI!&rf=viewer_4"
        
        file.add({
          data: {
            folder: this.data.input,
            name: null,
            type: typelink
          }
        }).then(res =>{
          wx.showToast({
            title: '上传成功',
            icon: 'success'
          })

          wx.reLaunch({
            url: '../user/user?id=' + this.data._openid,
          })
          })
    

  },

  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  }
})