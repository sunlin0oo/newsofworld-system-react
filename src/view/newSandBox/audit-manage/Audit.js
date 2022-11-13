import axios from 'axios'
import React from 'react'
import { useEffect, useState } from 'react'
import { Table, Tag, Button, notification} from 'antd'


export default function Audit() {
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'));

  const [dataSource, setDataSource] = useState([]);
  // 权限对象
  const [roleObj] = useState({
    '1': 'superadmin',
    '2': 'admin',
    '3': 'editor'
  });
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data;
      console.log('res.data', res.data);
      setDataSource(
        // 如果是超级管理员则返回所有的列表
        roleObj[roleId] === 'superadmin' ? list : [
          // 过滤出自己
          ...list.filter(item => item.author === username),
          // 过滤出自己区域及权限小于自己的
          ...list.filter(item => item.region === region && item.roleId > roleId)
        ]
      );
    })
  }, [region, roleId, roleObj, username]);

  const columns = [
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
          <Button type='primary' onClick={()=>handleAudit(item,2,1)}>通过</Button>
          <Button danger onClick={()=>handleAudit(item,3,0)}>驳回</Button>
        </div>
      }
    },
  ];
  const handleAudit = (item,auditState,publishState) => {
    setDataSource(dataSource.filter(data=>data.id !== item.id));
    axios.patch(`/news/${item.id}`,{
      auditState,
      publishState
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`, // 改成邮件通知比较好一些
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
