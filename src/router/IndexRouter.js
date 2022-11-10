/* eslint-disable array-callback-return */
import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../view/login/Login'
import NewsSandBox from '../view/newSandBox/NewsSandBox'
import Redirect from '../components/Redirect';
import Home from '../view/newSandBox/home/Home'
import UserList from '../view/newSandBox/user-manage/UserList'
import RoleList from '../view/newSandBox/right-manage/RoleList'
import RightList from '../view/newSandBox/right-manage/RightList'
import NotFound from '../view/nopermission/NotFound'
import NewsAdd from '../view/newSandBox/news-manage/NewsAdd'
import NewsDraft from '../view/newSandBox/news-manage/NewsDraft'
import NewsCategory from '../view/newSandBox/news-manage/NewsCategory'
import Audit from '../view/newSandBox/audit-manage/Audit'
import AuditList from '../view/newSandBox/audit-manage/AuditList'
import Unpublished from '../view/newSandBox/publish-manage/Unpublished'
import Published from '../view/newSandBox/publish-manage/Published'
import Sunset from '../view/newSandBox/publish-manage/Sunset'
import axios from 'axios';

// 路由哈希表
const LocalRouterMap = {
    "/user-manage/list": <UserList />,
    "/right-manage/role/list": <RoleList />,
    "/home": <Home />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,
}
export default function IndexRouter() {
    const [backrouteList, setBackRouteList] = useState([]);
    useEffect(() => {
        // promise.all()成功时，在then（result）中result是个数组
        Promise.all([
            axios.get(`/rights`),
            axios.get(`/children`),
        ]).then(res => {
            console.log(res);
            // 将所有的权限放在一块，扁平化处理
            setBackRouteList([...res[0].data, ...res[1].data])
        })
    }, [])
    const { role:{rights} } = JSON.parse(localStorage.getItem('token'));

    const checkRoute = (item) =>{
        // 判断送进来路由是否有对应组件存在 且 路由是打开状态  才可以进行访问
        return LocalRouterMap[item.key] && item.pagepermisson
    }

    const checkUserPermission = (item) =>{
        // 判断用户权限是否包含此路由;若包含则可以渲染路由
        return rights.includes(item.key)
    }
    return (
        <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/' element={<AuthComponent>{<NewsSandBox />}</AuthComponent>}>
                {/* 动态创建路由 */}
                {
                    backrouteList.map(item => {
                        if(checkRoute(item) && checkUserPermission(item)){
                            return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]}></Route>
                        }
                        return null
                    }
                    )
                }
                {/* <Route path='home' element={<Home></Home>}></Route>
                <Route path='user-manage/list' element={<UserList></UserList>}></Route>
                <Route path='right-manage/role/list' element={<RoleList></RoleList>}></Route>
                <Route path='right-manage/right/list' element={<RightList></RightList>}></Route> */}
                <Route path='' element={<Redirect to='/home'></Redirect>}></Route>
                {
                    // 解决数据没有传输过来导致路由无法渲染的问题(会短暂的存在Notfound的图标)
                    backrouteList.length > 0 && <Route path='*' element={<NotFound></NotFound>}></Route>
                }
            </Route>
        </Routes>
    )
}

// 路由拦截组件的封装
function AuthComponent({ children }) {
    const isLogin = localStorage.getItem('token');
    return isLogin ? children : <Redirect to='/login'></Redirect>;
}
