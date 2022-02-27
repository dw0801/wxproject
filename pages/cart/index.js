// pages/cart/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0,
  },

  // 点击收货地址
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        const address = result
        address.all =
          address.provinceName +
          address.cityName +
          address.countyName +
          address.detailInfo
        wx.setStorageSync('address', address)
      },
    })
  },
  // 商品的选中事件
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let { cart } = this.data
    const index = cart.findIndex((v) => v.goods_id === goods_id)
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },
  // 设置购物车状态 重新计算 底部工具数据 并且将数据返回data和缓存中
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach((v) => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断数组是否为空
    allChecked = cart.length ? allChecked : false
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    })
    wx.setStorageSync('cart', cart)
  },
  // 商品全选功能
  handleItemCheck() {
    let { cart, allChecked } = this.data
    allChecked = !allChecked
    cart.forEach((v) => (v.checked = allChecked))
    this.setCart(cart)
  },
  // 商品数量的编辑功能
  handleItemNumEdit(e) {
    const { operation, id } = e.currentTarget.dataset
    let { cart } = this.data
    const index = cart.findIndex((v) => v.goods_id === id)
    if (cart[index].num === 1 && operation === -1) {
      wx.showModal({
        title: '提示',
        content: '确定要删除此商品吗？',
        success: (res) => {
          if (res.confirm) {
            cart.splice(index, 1)
            this.setCart(cart)
          }
        },
      })
    } else {
      cart[index].num += operation
      this.setCart(cart)
    }
  },

  // 点击了结算
  handlePay() {
    const { address, totalNum } = this.data
    // 判断是否有地址
    if (!address.userName) {
      wx.showToast({
        title: '你没有选择收货地址',
        icon: 'none',
      })
      return
    }
    // 判断有没有选购商品
    if (totalNum === 0) {
      wx.showToast({
        title: '你没有商品',
        icon: 'none',
      })
      return
    }
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  },
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
    const cart = wx.getStorageSync('cart') || []
    // const allChecked = cart.length ? cart.every((v) => v.checked) : false
    // 总价格 总数量
    this.setData({
      address,
    })
    this.setCart(cart)
  },

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
