// pages/goods_detail/index.js
// 数据请求
import { request } from '../../request/index.js'
// 使小程序能使用ES7的async
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false,
  },
  GoodsInfo: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages()
    let currentPages = pages[pages.length - 1]
    let options = currentPages.options
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
  },
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: '/goods/detail',
      data: { goods_id: goods_id },
    })
    this.GoodsInfo = res
    // 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync('collect') || []
    let isCollect = collect.some((v) => v.goods_id === this.GoodsInfo.goods_id)
    this.setData({
      goodsObj: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // iphone部分手机不识别 webp图片格式
        goods_introduce: res.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: res.pics,
      },
      isCollect,
    })
  },
  // 点击预览图片
  handlePreviewImage(e) {
    const { index } = e.currentTarget.dataset
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid)
    wx.previewImage({
      current: urls[index], // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
    })
  },

  // 点击加入购物车
  handleCardAdd() {
    // 获取缓存购物车数组
    let cart = wx.getStorageSync('cart') || []
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      cart[index].num++
    }
    wx.setStorageSync('cart', cart)
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    })
  },
  // 点击商品图标收藏
  handleCollect() {
    let isCollect = false
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 判断该商品是否被收藏
    let index = collect.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id)
    // 当index !== -1 表示已收藏
    if (index !== -1) {
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: 'true',
      })
    } else {
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: 'true',
      })
    }
    // 把数组存入缓存
    wx.setStorageSync('collect', collect)
    // 修改data中的属性 isCollect
    this.setData({
      isCollect,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
})
