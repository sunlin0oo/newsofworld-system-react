import React from 'react'
import { Outlet } from 'react-router-dom'
//components
import SideMenu from '../../components/sanbox/SideMenu'
import TopHeader from '../../components/sanbox/TopHeader'
// antd
import { Layout } from 'antd';
// css
import './newSandBox.css'
const { Content } = Layout;
export default function NewsSandBox() {
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
          {/* 孩子*/}
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>

  )
}
