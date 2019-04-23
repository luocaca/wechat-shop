const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    goods: [],
    curPage: 1,
    pageSize: 666,
    sysCoupons:[]
  },
  onLoad: function() {

    var _this = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        _this.setData({
          sysCoupons: res.data
        });
      }
    })
    
  },
  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function() {
    this.setData({
      inputVal: ""
    });
  },
  getGoodsList: function(append) {

    var that = this;
    wx.showLoading({
      "mask": true
    })
    WXAPI.goods({
      categoryId: "",
      nameLike: that.data.inputVal,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    }).then(function(res) {
      wx.hideLoading()
      if (res.code == 404 || res.code == 700) {
        let newData = {
          loadingMoreHidden: false
        }
        if (!append) {
          newData.goods = []
        }
        that.setData(newData);
        return
      }
      let goods = [];
      if (append) {
        goods = that.data.goods
      }
      for (var i = 0; i < res.data.length; i++) {
        goods.push(res.data[i]);
      }
      that.setData({
        loadingMoreHidden: true,
        goods: goods,
      });
    })
  },
  inputTyping: function(e) {

    let that = this;

    this.setData({
      inputVal: e.detail.value
    });

    // this.getGoodsList()

    this.getGoodsList(false)



  }
});