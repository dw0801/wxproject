// 数据请求
import { request } from '../../request/index.js'
// 使小程序能使用ES7的async
import regeneratorRuntime from '../../lib/runtime/runtime'
import { requestPayment } from '../../utils/asyncWx.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0,
  },

  // 设置购物车状态 重新计算 底部工具数据 并且将数据返回data和缓存中
  setCart(cart) {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取缓存中的地址
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 复选框为选中的商品
    cart = cart.filter((v) => v.checked)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address,
    })
    // const allChecked = cart.length ? cart.every((v) => v.checked) : false
    // 总价格 总数量
  },
  // 点击支付按钮
  async handleOrderPay() {
    // 获取本地token
    const token = wx.getStorageSync('token')
    // 判断有无token
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      })
    }
    // 创建订单
    // 准备请求头参数
    // const header = { Authorization: token }
    // 准备请求体参数
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    const cart = this.data.cart
    let goods = []
    cart.forEach((v) =>
      goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price,
      })
    )
    const orderParams = { order_price, consignee_addr, goods }
    // 准备发送请求 创建订单 获取订单编号
    const { order_number } = await request({
      url: '/my/orders/create',
      method: 'POST',
      data: orderParams,
    })
    // 准备发起预支付的接口
    /*   const { pay } = await request({
      url: '/my/orders/req_unifiedorder',
      method: 'POST',
      header,
      data: { order_number },
    })
    const res = await requestPayment(pay) */
    wx.showToast({
      title: '成功支付',
      icon: 'success',
    })
    // 清除选中的商品  上面的cart定义的就是选中的商品
    let newCart = wx.getStorageSync('cart')
    newCart = newCart.filter((v) => !v.checked)
    wx.setStorageSync('cart', newCart)
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/order/index',
      })
    }, 1200)
  },
})
