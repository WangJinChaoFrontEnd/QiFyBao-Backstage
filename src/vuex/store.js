import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 定义状态
  state: {
    newsId:0,
    title:'',
    newstype:0,
    newsImg:'',
    content:'',
    summary:'',
    newsurl:'',
    tdate:'',
    fileC1:0,
    newsState:0
  }
  // mutations:{
  //   newAuthor(state,msg){
  //     state.newsId=msg,
  //     state.title=msg,
  //     state.newstype=msg,
  //     state.newsImg=msg,
  //     state.content=msg,
  //     state.summary=msg,
  //     state.newsurl=msg,
  //     state.tdate=msg,
  //     state.newsState=msg
  //   }
  // }
})

export default store
