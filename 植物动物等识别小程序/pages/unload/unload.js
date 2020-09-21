// pages/unload/unload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    // 根据id来判断是(是植物识别还是动物识别或者其它识别)
    id: "0",
    imgUrl: [],
    // 图片识别返回信息
    imageNews: [],
    apiUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      title: options.title,
      id: options.id
    })
  },
  chooseImage() {
    const that = this;
    // 从本地相册选择图片或者使用照相机拍照
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],   // 可以选择原图或者压缩后的图片
      sourceType: ['album', 'camera'],        // 可选择性开放访问相册、相机
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const temFilePaths = res.tempFilePaths
        that.setData({
          imgUrl: temFilePaths
        })
        console.log(that.data.imgUrl);
        wx.getFileSystemManager().readFile({
          filePath: that.data.imgUrl[0],
          encoding: "base64",
          success: (res) => {
            let baseImg = res.data;
            that.imageDicern(baseImg);
          },
          fail: () => {
            console.log("错误")
          }
        })
      }
    })
  },
  imageDicern(baseImage) {
    let access_token = "";
    let that = this;
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=Va5yQRHlA4Fq5eR3LT0vuXV4&client_secret=0rDSjzQ20XUj5itV6WRtznPQSzr5pVw2&',
      data: {
        grant_type: 'client_credentials',
        client_id: 'TGDAAjmn50Kpo4zgGuQVMr4m',
        client_secret: 'tENK3lqbXUMR2ZacUCbq4LBtZyBGxDyt'
      },
      success(res) {
        access_token = res.data.access_token;
        let url = that.getID(that.data.id);
        wx.request({
          url: `${url}?access_token=${access_token}`,
          method: 'post',
          header: {
            'Content-type': "application/x-www-form-urlencoded"
          },
          data: {
            // base64图片，注意不需要data:image/jpg;base64,
            image: baseImage,
            // 返回百科信息的结果数，默认为0，即不返回
            baike_num: 1
          },
          success(res) {
            that.setData({
              imageNews: res.data.result
            })
            console.log(that.data.imageNews)
          }
        })
      }
    })
  },
  // 货物百度api
  getID(id) {
    switch (id) {
      case "0": return "https://aip.baidubce.com/rest/2.0/image-classify/v1/plant"; break;  // 植物识别
      case "1": return "https://aip.baidubce.com/rest/2.0/image-classify/v1/animal"; break;  // 动物识别
      case "2": return "https://aip.baidubce.com/rest/2.0/image-classify/v2/logo"; break;   // logo识别
      case "3": return "https://aip.baidubce.com/rest/2.0/image-classify/v1/classify/ingredient"; break;   // 果蔬识别
      case "4": return "https://aip.baidubce.com/rest/2.0/image-classify/v2/dish"; break;   // 菜品识别
      case "5": return "https://aip.baidubce.com/rest/2.0/image-classify/v1/redwine"; break;   // 红酒识别
      case "6": return "https://aip.baidubce.com/rest/2.0/image-classify/v1/currency"; break;   // 货币识别 
      case "7": return "https://aip.baidubce.com/rest/2.0/image-classify/v1/landmark"; break;   // 地标识别
    }
  }
})