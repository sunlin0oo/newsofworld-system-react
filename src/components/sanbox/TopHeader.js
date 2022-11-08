/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {
  UserOutlined,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Space, Menu, Avatar } from 'antd';
import WithRouter from '../WithRouter'
const { Header } = Layout;
function TopHeader(props) {
  const [collapsed, setCollapsed] = useState(false);
  const {username,role:{roleName}} = JSON.parse(localStorage.getItem('token'))
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          {roleName}
        </a>
      ),
    },
    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ]
  const click = (e) => {
    console.log('e', e);
    console.log('props', props);
    //注意this指向问题，采用箭头函数this就指向当前组件
    if (e.key === '2') {
      localStorage.removeItem('token');
      props.history.push('/login');
    }

  }

  const menu = (
    <Menu
      items={items}
      onClick={click}
    />
  );



  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
      className: 'trigger',
      onClick: () => setCollapsed(!collapsed),
    })} */}
      {
        // 头导航栏是否收起
        collapsed ? <MenuUnfoldOutlined onClick={() => changeCollapsed()}></MenuUnfoldOutlined> :
          <MenuFoldOutlined onClick={() => changeCollapsed()}></MenuFoldOutlined>
      }
      <div style={{ float: 'right' }}>
        <span>欢迎{username}回来</span>
        <Dropdown overlay={menu}>
          <a onClick={e => e.preventDefault()}>
            <Space>
              <Avatar size="large" icon={<UserOutlined />} />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  )
}

export default WithRouter(TopHeader)
