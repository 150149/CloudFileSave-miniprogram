// pages/login/login.js
const db = wx.cloud.database()
const userList = db.collection('user')

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ColorList: app.globalData.ColorList    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading({
      success: (res) => {},
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

  getUserInfo:function(result){
    wx.cloud.callFunction({
      name: 'getopenid',
      complete: res=>{
        userList.where({
          _openid: res.result.openId
        }).count().then(res2 =>{

          if(res2.total==0){

            userList.add({
              data: result.detail.userInfo
            }).then(res3=>{

                    userList.where({
                      _openid: this.data.openid
                    }).get().then(res4=>{
                      wx.navigateTo({
                        url: '../user/user?id=' + res.result.openId,
                      })
                    })
                   
                  })
            
           }
          else if(res2.total>=1){
            userList.where({
              _openid: this.data.openid
            }).get().then(res4=>{
              wx.navigateTo({
                url: '../user/user?id=' + res.result.openId,
              })
            })
            
          }
        
      
    })
  }
  })
}

})