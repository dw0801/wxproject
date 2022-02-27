//Page Object
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧滚动条距离顶部的距离
    scrollTop: 0,
  },
  // 接口返回数据
  Cates: [],
  async getCates() {
    /* request({
      url: '/categories',
    }).then((res) => {
      this.Cates = res
      // 把返回的数据存入到本地数据中
      wx.setStorageSync('cates', {
        time: Date.now(),
        data: this.Cates,
      })

      //构造左侧的大菜单数据
      let leftMenuList = this.Cates.map((v) => v.cat_name)
      //构造右侧的大菜单数据
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent,
      })
    }) */
    const res = await request({ url: '/categories' })
    this.Cates = res
    // 把返回的数据存入到本地数据中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates,
    })

    //构造左侧的大菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name)
    //构造右侧的大菜单数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent,
    })
  },
  // 左侧菜单点击事件
  handelItemTap(e) {
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0,
    })
  },
  //options(Object)
  onLoad: function (options) {
    /*  先判断一下本地数据有没有就的数据
    没有就发送新请求   有就使用本地的 */

    // 获取本地存储的数据
    const Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this.getCates()
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()
      } else {
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map((v) => v.cat_name)
        //构造右侧的大菜单数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    }
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
})
