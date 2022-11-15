import React from 'react'
import { HashRouter, } from 'react-router-dom'
import './App.css'
import IndexRouter from './router/IndexRouter';
import { Provider } from 'react-redux';
import store from './redux/store';
export default function App() {
  // 通过Provider对store进行传递==>所有Connect包装的组件都可以轻松的获取到store
  return (
    <Provider store={store}>
      <HashRouter>
        <IndexRouter></IndexRouter>
      </HashRouter>
    </Provider>

  )
}
