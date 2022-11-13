import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, notification } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import WithRouter from '../../../components/WithRouter';
import axios from 'axios';
const { confirm } = Modal;
function NewsDraft(props) {
  const { username } = JSON.parse(localStorage.getItem('token'));

  const [dataSource, setDataSource] = useState([]);
  // 筛选中未审核的新闻稿件
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      console.log(res.data);
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
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        // 跳转到新闻的详细界面
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (key) => {
        return <Tag color="blue" key={key}>{key}</Tag>
      }
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return <Tag color="blue" key={category}>{category.title}</Tag>
      }
    },
    {
      title: '操作',
      // 什么都不写的话会直接获取到这一项
      render: (item) => {
        return <div>
          <Button type='primary' shape="circle" icon={<EditOutlined />} onClick={() => props.history.push(`/news-manage/update/${item.id}`)} />
          <Button danger shape="circle" size={'large'} icon={<DeleteOutlined />} onClick={() => delConfirm(item)} />
          <Button type='primary' shape="circle" size={'large'} icon={<VerticalAlignTopOutlined />} onClick={() => handleCheck(item.id)} />
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
    // 前后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
    axios.delete(`/news/${item.id}`);
  }

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState:2
    }).then(res => {
      props.history.push('/audit-manage/list')
      notification.info({
        message: `通知`,
        description:
          `恭喜您，成功提交审核,您可以到审核列表进行查看`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
        rowKey={item => item.id} />
    </div>
  )
}
export default WithRouter(NewsDraft)