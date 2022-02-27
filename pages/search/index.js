import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 按钮是否显示
    isFocus: false,
    // 输入框的值
    inpValue: '',
  },
  TimeId: -1,
  handleInput(e) {
    // 获取输入框的值
    const { value } = e.detail
    if (!value.trim()) {
      clearTimeout(this.TimeId)
      this.setData({
        goods: [],
        isFocus: false,
      })
      return
    }
    this.setData({
      isFocus: true,
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      this.qsearch(value)
    }, 1000)
  },
  // 发送请求
  async qsearch(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } })
    this.setData({
      goods: res,
    })
  },
  // 点击取消事件
  handleCancel() {
    this.setData({
      inpValue: '',
      goods: [],
      isFocus: false,
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
  onShow: function () {},

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
