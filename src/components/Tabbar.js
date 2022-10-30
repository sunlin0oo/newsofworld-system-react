import React from 'react'
import { NavLink } from 'react-router-dom'
import './Tabbar.css'
export default function Tabbar() {
  return (
    <div>
        <footer>
            <ul>
                {/*NavLink会在选中的标签上添加className==>active
                另一种 NavLink 可以有一个属性className支持回调函数的写法==>解构出isActive==>选中时isAcitve===true,会有一个active*/}
                <li>
                    <NavLink to='/films' className={({isActive})=>isActive?'sunlinactive':''}>电影</NavLink>
                </li>
                <li>
                    <NavLink to='/cinemas' className={({isActive})=>isActive?'sunlinactive':''}>影院</NavLink>
                </li>
                <li>
                    <NavLink to='/centers' className={({isActive})=>isActive?'sunlinactive':''}>我的</NavLink>
                </li>
            </ul>
        </footer>
    </div>
  )
}
