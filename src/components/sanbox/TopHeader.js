/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import {
  UserOutlined ,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Dropdown, Space, Menu, Avatar } from 'antd';

const { Header } = Layout;
export default function TopHeader() {
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
              超级管理员
            </a>
          ),
        },
        {
          key: '2',
          danger: true,
          label: '退出',
        },
      ]}
    />
  );
  const [collapsed, setCollapsed] = useState(false);
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
        collapsed ? <MenuUnfoldOutlined onClick={() => changeCollapsed()}></MenuUnfoldOutlined> :
          <MenuFoldOutlined onClick={() => changeCollapsed()}></MenuFoldOutlined>
      }
      <div style={{ float: 'right' }}>
        <span>欢迎${ }回来</span>
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
