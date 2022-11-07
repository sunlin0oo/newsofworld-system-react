/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm';
const { confirm } = Modal;

// const { Option } = Select;
export default function UserList() {
  // 控制是否添加表单
  const addForm = useRef(null);
  // 控制是否更新表单
  const updateForm = useRef(null);
  // 获取的用户信息
  const [dataSource, setDataSource] = useState([]);
  // 添加用户弹窗状态
  const [IsAddVisible, setIsAddVisible] = useState(false);
  // 禁止更新状态
  const [isUpdateDisable, setIsUpdateDisable] = useState(false)
  // 添加用户信息更新状态
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  // 获得区域信息状态
  const [roleList, setRoleList] = useState(false);
  // 获得权限状态信息
  const [reigonList, setReigonList] = useState(false);
  // 获取当前选中的表单
  const [currentItem, setCurrentItem] = useState(null);
  // 连表关注users--role
  useEffect(() => {
    axios.get('http://localhost:8000/users?_expand=role').then(res => {
      console.log('UserList-res.data', res.data)
      const list = res.data;
      setDataSource(list);
    })
  }, [])
  // 获取权限
  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(res => {
      console.log('setRoleList-res.data', res.data)
      const list = [];
      // 修改数据目的:迎合options中的数据结构
      res.data.map((item) => {
        return list.push({
          ...item,
          title: item.roleName,
          value: item.roleName,
        })
      })
      setRoleList(list);
    })
  }, [])
  // 获取区域信息
  useEffect(() => {
    axios.get('http://localhost:8000/regions').then(res => {
      console.log('setReigonList-res.data', res.data)
      const list = res.data;
      setReigonList(list);
    })
  }, [])
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters:[
        ...reigonList.map(item=>({
          text:item.title,
          value:item.value
        })),
        {
          text:'全球',
          value:'全球'
        }
      ],
      onFilter:(value,item)=>{
        if(value === '全球'){
          return item.region === ''
        }else{
          return item.region === value
        }
      },
      key: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return <b>{role.roleName}</b>
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (username) => {
        return <b>{username}</b>
      }
    },

    {
      title: '用户状态',
      dataIndex: 'roleState',
      // 第二个参数就是item
      render: (roleState, item) => {
        return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)}></Switch>
      }
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
            <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={() => handleUpdate(item)} />
          </Popover>
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} disabled={item.default} />
        </div>
      }
    },
  ];
  // 更新函数===>应该需要再去调一下接口===>实时更新item才可以，问题待处理
  function handleUpdate(item) {
    // console.log(item);
    // item获取到点击对应标签值
    setIsUpdateVisible(true);//异步
    setTimeout(() => {
      setCurrentItem(item);
      // 为什么加在这里就可以使用而加在外面就不可以使用????  异步的问题
      if (item.roleId === 1) {
        // 禁用
        setIsUpdateDisable(true);
        console.log('item.roleId', isUpdateDisable)
      } else {
        setIsUpdateDisable(false);
        console.log('Not-item.roleId', isUpdateDisable)
      }
      // 获取到表单所有内容
      // 要注意状态的更新不保证是同步的，当设置为true时，状态没有更新完，表单也没有创建完毕，组件也没生成，故会报错
      updateForm.current.setFieldsValue({
        ...item,// 拆解
        roleName: item.role.roleName
      });
    }, 0)

  }

  const handleChange = (item) => {
    // console.log('item', item);
    item.roleState = !item.roleState
    // 在这里已经更新，但是在页面中还是旧值
    // 强制更新
    setDataSource([...dataSource]);
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState: item.roleState
    })
  }

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
    axios.delete(`http://localhost:8000/users/${item.id}`);
  }

  const addFormOk = () => {
    // 可以收集到子组件传来的表单信息
    addForm.current.validateFields().then(res => {
      setIsAddVisible(false);
      // 重置表单
      addForm.current.resetFields();
      // 找到与当前表单同步的权限列表
      const currentList = roleList.filter(item => item.title === res.roleName)[0];
      // post到后端，生成id，再设置datasource，方便后面 的删除和更新处理(因为id不会自动生成,需要放在后端进行生成)
      // 这里res是你表单的格式，要注意表单格式匹配后端格式
      axios.post('http://localhost:8000/users', {
        ...res,
        'roleState': true,
        'default': false,
        'roleId': currentList.id
      }).then(res => {
        console.log(res.data);
        // 有则替换，无则不动
        setDataSource([...dataSource, {
          ...res.data,
          // 这一步解决一开始会存在无法显示角色名称的问题，是因为自己创建的数据，没有role字段，当刷新完之后才会存在role字段,手动与后端添加上关联,添加到DataSource，用于前端的显示
          role: currentList
        }])
      })
      console.log(setDataSource);
    }).catch(err => {
      console.log(err)
    })
  }

  const updateFormOk = () => {
    // 可以收集到子组件传来的表单信息
    updateForm.current.validateFields().then(value => {
      console.log('value', value);
      const currentList = roleList.filter(item => item.title === value.roleName)[0];
      setIsUpdateVisible(false);
      // 这里res是你表单的格式，要注意表单格式匹配后端格式
      setDataSource(dataSource.map(item => {
        // 从dataSource中找到与当前表单同步的id
        if (item.id === currentItem.id) {
          return {
            ...item,
            ...value,
            role: currentList
          }
        }
        return item
      }))
      // 存在问题:当修改完之后，超级管理员，你仍然是可以选择你的所属区域
      axios.patch(`http://localhost:8000/users/${currentItem.id}`, {
        'password':value.password,
        'region':value.region,
        'roleId':currentList.id,
        'username':value.password,
      });
    })

  }

  return (
    <div>
      <Button onClick={() => setIsAddVisible(true)}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }}
        // 之前的路由管理是因为字段中带有key，在字段没有key的情况下要进行自我设置
        rowKey={(item) => item.id}></Table>
      {/* 添加用户弹窗 */}
      <Modal
        open={IsAddVisible}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => setIsAddVisible(false)}
        onOk={() => {
          // console.log('add',addForm);
          addFormOk()
        }}
      >
        {/* 这里的ref像是回调函数 */}
        <UserForm ref={addForm} roleList={roleList} reigonList={reigonList}></UserForm>
      </Modal>

      {/* 更新用户弹窗 */}
      <Modal
        open={isUpdateVisible}
        title="更新用户信息"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setIsUpdateVisible(false);
          setIsUpdateDisable(!isUpdateDisable);
        }}
        onOk={() => {
          // console.log('add',addForm);
          updateFormOk()
        }}
      >
        {/* 这里的ref像是回调函数 */}
        <UserForm ref={updateForm} roleList={roleList} reigonList={reigonList} isUpdateDisable={isUpdateDisable}></UserForm>
      </Modal>
    </div>
  )
}
