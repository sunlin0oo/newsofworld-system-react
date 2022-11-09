import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../view/login/Login'
import NewsSandBox from '../view/newSandBox/NewsSandBox'
import Redirect from '../components/Redirect';
import Home from '../view/newSandBox/home/Home'
import UserList from '../view/newSandBox/user-manage/UserList'
import RoleList from '../view/newSandBox/right-manage/RoleList'
import RightList from '../view/newSandBox/right-manage/RightList'
import NotFound from '../view/nopermission/NotFound'
export default function IndexRouter() {
    return (
        <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/' element={<AuthComponent>{<NewsSandBox />}</AuthComponent>}>
                <Route path='' element={<Redirect to='/home'></Redirect>}></Route>
                <Route path='home' element={<Home></Home>}></Route>
                <Route path='user-manage/list' element={<UserList></UserList>}></Route>
                <Route path='right-manage/role/list' element={<RoleList></RoleList>}></Route>
                <Route path='right-manage/right/list' element={<RightList></RightList>}></Route>
                <Route path='*' element={<NotFound></NotFound>}></Route>
            </Route>
        </Routes>
    )
}

// 路由拦截组件的封装
function AuthComponent({ children }) {
    const isLogin = localStorage.getItem('token');
    return isLogin ? children : <Redirect to='/login'></Redirect>;
}
