// pages/delete/delete.js
const app = getApp();
const db = wx.cloud.database()
const userList = db.collection('user')
const file = db.collection('file')
const _ = db.command
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
            console.log("删除界面用户未注册" + options.id)
            wx.showLoading({
              title: '用户未注册..',
            })
            wx.reLaunch({
              url: '../login/login',
            })
          }
        })


      var list= new Array()
      var fileid
      list[0]=options.delid

      file.where({
        image: options.delid
      }).get().then(res=>{
        fileid=res.data[0]._id

        if(res.data[0]._openid!=options.id){
          console.log("越权删除！" + options.id)
            wx.showLoading({
              title: '越权删除！..',
            })
            wx.reLaunch({
              url: '../login/login',
            })
            return
        }
      })
  
      console.log("已过安全校验"+ options.id)
      wx.cloud.deleteFile({
        fileList: list,
        success: res => {
          console.log("从文件库中删除完成")
          db.collection('file').doc(fileid).remove({
            success: function(res) {
              console.log("从file库中删除完成")
            wx.showToast({
              title: '删除成功',
            })

            console.log("正在重启小程序")
             wx.reLaunch({
            url: '../user/user?id=' + options.id,
          })
            }
          })
        
        
        },
        fail: console.error
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