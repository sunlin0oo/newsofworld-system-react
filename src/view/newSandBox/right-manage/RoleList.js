import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Popover, Switch, Tree } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal;

export default function RoleList() {
  // 权限信息
  const [dataSource, setDataSource] = useState([]);
  // 权限列表
  const [rightList, setRightList] = useState([]);
  // 当前项权限
  const [currentRights, setCurrentRights] = useState([]);
  // 当前选中项id
  const [currentId, setCurrentId] = useState(0);
  // 控制气泡框
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 存储权限信息
  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(res => {
      console.log('Role-res.data', res.data)
      const list = res.data;
      setDataSource(list);
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',

    },
    {
      title: '操作',
      // 什么都不写的话会直接获取到这一项
      render: (item) => {
        return <div>
          <Popover
            content={<div style={{ textAlign: 'center' }}>
              {/* 根据后端控制权限 */}
              <Switch ></Switch>
            </div>}
            title="页面配置项"
          // onOpenChange={handleOpenChange}
          >
            {/*  */}
            <Button type='primary' shape="circle" icon={<EditOutlined />} onClick={() => {
              setIsModalOpen(true);
              // 获取到点击选择权限项的rights
              setCurrentRights(item.rights); 
              // 获取到点击选择权限项的id
              setCurrentId(item.id);
            }
            } />
          </Popover>
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
        </div>
      }
    },
  ];

  // 确认删除框==>对话框
  const delConfirm = (item) => {
    confirm({
      title: 'Do you Want to delete these items?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      onOk() {
        deleteMethod(item)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const deleteMethod = (item) => {
    console.log(item);
    // 当前页面同步状态 + 后端同步
    // 根据grade判断层级字段
    // 这是删除一级菜单的情况
    // 首先处理页面状态同步
    setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
    // 在处理后端
    axios.delete(`http://localhost:8000/roles/${item.id}`)
  }
  // ---------- END ----------
  //---------- 控制气泡框 ----------
  const handleOk = () => {
    // console.log(currentRights);
    setIsModalOpen(false);
    // 同步datasource
    setDataSource(dataSource.map(item=>{
      if(item.id === currentId){
        return {
          ...item, // 将选择的item 展开
          rights:currentRights// 将新的rightList 覆盖上去
        }
      }
      return item;
    }))
        axios.patch(`http://localhost:8000/roles/${currentId}`, {
          rights: currentRights,
      })
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // ---------- END ----------
  // 存储树形结构 根据文档给予的格式，处理字段
  useEffect(() => {
    // _embed=comments(数组名字)==>进行表关联的功能==>向下关联
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      console.log('res.data', res.data);
      // console.log('MakemenuTree(res.data)', MakemenuTree(res.data));
      setRightList(res.data);
    })
  }, [])
  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    setCurrentRights(checkedKeys.checked);
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        // 之前的路由管理是因为字段中带有key，在字段没有key的情况下要进行自我设置
        rowKey={(item) => item.id}></Table>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          // 父子节点选中状态是否关联==>但是存在一个问题是 当你想要选中父节点，把下面的子节点都选中应该如何处理呢?
          checkStrictly = {true}
          checkedKeys={currentRights}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
