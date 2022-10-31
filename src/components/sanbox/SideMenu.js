import React, { useState } from 'react'
import { Layout, Menu, Button } from 'antd';
import {
  VideoCameraOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import './css/index.css'
const { Sider } = Layout;
// 侧边栏
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
/**模拟后端数组结构
{
  key:'',
  title:'',
  icon:''
}*/
const items = [
  getItem('首页', '/home', <PieChartOutlined />),
  getItem('用户管理', '/user-manage', <MailOutlined />, [
    getItem('用户列表', '/user-manage/list'),
  ]),
  getItem('权限管理', '/right-manage', <AppstoreOutlined />, [
    getItem('角色列表', 'right-manage/role/list'),
    getItem('权限列表', 'right-manage/right/list'),
  ]),
  getItem('新闻管理', 'sub3', <DesktopOutlined />, [
    getItem('Option 9', '1'),
    getItem('Option 10', '2'),
  ]),
  getItem('审核管理', 'sub4', <ContainerOutlined />, [
    getItem('Option 9', '3'),
    getItem('Option 10', '4'),
  ]),
  getItem('发布管理', 'sub5', <VideoCameraOutlined />, [
    getItem('Option 9', '5'),
    getItem('Option 10', '6'),
    getItem('Submenu', 'sub6', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
  ]),
];

export default function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    // 不知道的去看文档
    <Sider trigger={null} collapsible collapsed={collapsed} reverseArrow={true} >
      <div className="logo" >全球新闻发布管理系统</div>
      <div style={{ width: '100%' }}>
        {/* 控制缩进侧边栏 */}
        <Button
          type="primary"
          onClick={toggleCollapsed}
          style={{
            marginBottom: 16,
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          items={items}
        />
      </div>
    </Sider>
  )
}
