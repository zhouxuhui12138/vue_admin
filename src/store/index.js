import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // 存储状态
  state: {
    token: ''
  },
  // 修改状态
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    DELECT_TOKEN(state) {
      state.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('activePath')
    }
  }
})
