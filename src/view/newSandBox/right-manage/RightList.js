import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;
export default function RightList() {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios.get('/rights?_embed=children').then(res => {
      console.log(res.data);
      const list = res.data;
      list.forEach(item => {
        if (item.children && item.children.length === 0) item.children = null
      })
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
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',

    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color="blue" key={key}>{key}</Tag>
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
              <Switch checked={item.pagepermisson} onChange={() => switchMethod(item)}></Switch>
            </div>}
            title="页面配置项"
            trigger={item.pagepermisson === undefined ? "null" : "click"}
          // onOpenChange={handleOpenChange}
          >
            {/*  */}
            <Button type='primary' shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson === undefined} />
          </Popover>
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
        </div>
      }
    },
  ];
  const switchMethod = (item) => {
    // 存在引用关系，则会一直受影响
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    // console.log(ite)
    // 强制更新
    setDataSource([...dataSource]);
    if ((item.grade === 1)) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      })
    }
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
    if (item.grade === 1) {
      // 这是删除一级菜单的情况
      // 首先处理页面状态同步
      setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
      // 在处理后端
      axios.delete(`/rights/${item.id}`)
    } else {
      // 思考新的实现方法！！！
      let list = dataSource.filter(data => data.id === item.rightId)// 去上级找到要删除的项,拿到的是父级的字段(一级菜单信息)
      console.log(list);
      list[0].children = list[0].children.filter(data => data.id !== item.id)// 去替换二级菜单，过滤掉不要的，过滤出要的
      // 这样的操作也会影响到dataSource，因为不是深复制，会导致改变
      setDataSource([...dataSource]);
      axios.delete(`/children/${item.id}`)
    }

  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }} />
    </div>
  )
}
