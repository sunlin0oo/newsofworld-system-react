import React, { useEffect, useState } from 'react'
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
import withRouter from '../../components/WithRouter';
import axios from 'axios'
const { Sider } = Layout;
// 侧边栏==>通过这个函数创建一个树结构==>如果要动态的创建直接创建树结构即可
// function getItem(label, key, icon, children, type) {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   };
// }
/**模拟后端数组结构
{
  key:'',
  title:'',
  icon:''
}*/
// const items = [
//   getItem('首页', '/home', <PieChartOutlined />),
//   getItem('用户管理', '/user-manage', <MailOutlined />, [
//     getItem('用户列表', '/user-manage/list'),
//   ]),
//   getItem('权限管理', '/right-manage', <AppstoreOutlined />, [
//     getItem('角色列表', 'right-manage/role/list'),
//     getItem('权限列表', 'right-manage/right/list'),
//   ]),
//   getItem('新闻管理', 'sub3', <DesktopOutlined />, [
//     getItem('Option 9', '1'),
//     getItem('Option 10', '2'),
//   ]),
//   getItem('审核管理', 'sub4', <ContainerOutlined />, [
//     getItem('Option 9', '3'),
//     getItem('Option 10', '4'),
//   ]),
//   getItem('发布管理', 'sub5', <VideoCameraOutlined />, [
//     getItem('Option 9', '5'),
//     getItem('Option 10', '6'),
//     getItem('Submenu', 'sub6', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
//   ]),
// ];
// 创建树结构
const MakemenuTree = (menuList)=>{
  const IconMap = [<PieChartOutlined />, 
  <VideoCameraOutlined />,
  <AppstoreOutlined />,
  <ContainerOutlined />,
  <DesktopOutlined />,
  <MailOutlined />,]
  const tree = [];
  // eslint-disable-next-line array-callback-return
  menuList.map((item,index) => {
    const note = {
      key:item.key,
      icon:IconMap[index],
      label:item.title
    }
    
    if(item.children){
      note.children = MakemenuTree(item.children)// 重新调用函数 创建一个子树进行使用
    }
    console.log('tree', tree);
    tree.push(note);
  })
  return tree;
}

function SideMenu(props) {
  const [items,setItems] = useState(null);
  const [menu,setMenu] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  useEffect(()=>{
    axios.get('http://localhost:8000/rights?_embed=children').then(res=>{
      console.log('res.data', res.data);
      console.log('MakemenuTree(res.data)', MakemenuTree(res.data));
      setItems(MakemenuTree(res.data))
    })
  },[])

  function click(e) {
    console.log('e', e);
    console.log('props', props);
    //注意this指向问题，采用箭头函数this就指向当前组件
    props.history.push(e.key);
  }
  function openChange() {
    console.log('OpenChange');
  }

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
          defaultSelectedKeys={['/home']}
          defaultOpenKeys={['/home']}
          mode="inline"
          theme="dark"
          items={items}
          onOpenChange={() => openChange()}
          onClick={click}
        />
      </div>
    </Sider>
  )
}

export default withRouter(SideMenu)
