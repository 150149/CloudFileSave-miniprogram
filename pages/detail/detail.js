// pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database()
const userList = db.collection('user')
const file = db.collection('file')
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
    if (options.id == null) {
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
    }).count().then(res => {
      if (res.total == 0) {
        console.log("用户界面用户未注册" + options.id)
        wx.showLoading({
          title: '用户未注册..',
        })
        wx.reLaunch({
          url: '../login/login',
        })
      }
    })

    this.setData({
      _openid: options.id,
      image: options.fileid
    })

    file.where({
      _openid: options.id,
      image: options.fileid
    }).count().then(res=>{
      if(res.total == 0) {
        console.log("详情界面id与image不匹配" + options.id)
        wx.showLoading({
          title: '非法访问..',
        })
        wx.reLaunch({
          url: '../login/login',
        })
      }
      else if(res.total==1){
        file.where({
          _openid: options.id,
          image: options.fileid
        }).get().then(res2=>{
          this.setData({
            _openid: options.id,
            image: options.fileid,
            data: res2.data[0]
          })
        })
      }
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
    if(event.detail.value!=null){
    this.setData({
      input: event.detail.value
    })

    file.doc(this.data.data._id).update({
      data: {
        name: event.detail.value
      },
    })
  }
  },

  download:function(event) {
    console.log(this.data.file)
    wx.showLoading({
      title: '正在下载...'
    })
    wx.cloud.downloadFile({
      
      fileID: this.data.data.image, // 文件 ID
      success: res => {
        // 返回临时文件路径
        //console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
        })

        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '下载完成',
          icon: 'success'
        })
      },
      fail: console.error
    })
    
  }
})