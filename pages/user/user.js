const app = getApp();
const db = wx.cloud.database()
const userList = db.collection('user')
const file = db.collection('file')


Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    gridCol: 3,
    skin: false
  },

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

    file.where({
      _openid: options.id,
      folder: null
    }).get().then(res => {
      this.setData({
        _openid: options.id,
        files: res.data
      })
    })

    file.where({
      _openid: options.id,
    }).get().then(res => {

      var j = 0
      var folders = new Array()
      var k = 0

      for (var i = 0; i < res.data.length; i++) {
        if (res.data[i].folder != null) {
          for (k = 0; k < folders.length; k++) {
            if (folders[k] == res.data[i].folder) {
              break;
            }
          }
          if (k >= folders.length - 1 && res.data[i].folder != folders[k]) {
            console.log("找到一个文件夹:" + res.data[i].folder)
            folders[j] = res.data[i].folder
            j++
          }
        }
      }
      this.setData({
        folders: folders
      })
    })
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  gridchange: function (e) {
    this.setData({
      gridCol: e.detail.value
    });
  },
  gridswitch: function (e) {
    this.setData({
      gridBorder: e.detail.value
    });
  },
  menuBorder: function (e) {
    this.setData({
      menuBorder: e.detail.value
    });
  },
  menuArrow: function (e) {
    this.setData({
      menuArrow: e.detail.value
    });
  },
  menuCard: function (e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
  switchSex: function (e) {
    this.setData({
      skin: e.detail.value
    });
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },

  newfold: function (event) {
    wx.navigateTo({
      url: '../newfold/newfold?id=' + this.data._openid,
    })
  },



  upload: function (event) {
    
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      fail: chooseResult => {
        wx.showToast({
          title: '该平台不支持上传文件',
          icon: "none"
        })
      },
      success: chooseResult => {
        wx.showLoading({
          title: '上传中.....',
        })
        // 将图片上传至云存储空间
        let rand = Math.floor(Math.random() * 1000000).toString() + '-' + chooseResult.tempFiles[0].name
        wx.cloud.uploadFile({
          // 指定上传到的云路径
          cloudPath: rand,
          // 指定要上传的文件的小程序临时文件路径
          filePath: chooseResult.tempFiles[0].path,
          // 成功回调
          success: res => {
            wx.hideLoading({
              success: (res) => {},
            })

            var typelink
            if (chooseResult.tempFiles[0].type == 'image') {
              typelink = "http://m.qpic.cn/psc?/V129kKld2rbPxR/45NBuzDIW489QBoVep5mcfuW9L3guXKmBkdmRLiLojilu6ggDuF9uLoHIHZuslkeq73YK8whkBMjYUcLug.j5hS7uA5U*jG.wNmQpfcTNpk!/b&bo=wADAAAAAAAADFzI!&rf=viewer_4"
            }
            if (chooseResult.tempFiles[0].type == 'video') {
              typelink = "http://m.qpic.cn/psc?/V129kKld2rbPxR/45NBuzDIW489QBoVep5mcfuW9L3guXKmBkdmRLiLojhdqfgLEZYYpicrzweOMFIpuO7INobTFK71GmKX06UuXiu5alL5G9NmdGsGL6sC3bg!/b&bo=wADAAAAAAAADFzI!&rf=viewer_4"
            }
            if (chooseResult.tempFiles[0].type == 'file') {
              typelink = "http://m.qpic.cn/psc?/V129kKld2rbPxR/ruAMsa53pVQWN7FLK88i5qvIw5dYCUMVFnq5qArqaNHJx5qp5ECWxF0LOR8*zkwOVag0df44tyBG0HtqUz45x3fsjfTweF6ptRw*IAyvuQ8!/b&bo=wADAAAAAAAADByI!&rf=viewer_4"
            }

            file.add({
              data: {
                image: res.fileID,
                folder: null,
                name: chooseResult.tempFiles[0].name,
                type: typelink
              }
            }).then(res => {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              })


              wx.reLaunch({
                url: '../user/user?id=' + this.data._openid,
              })
            })

          },
        })
      },
    })
  }
})