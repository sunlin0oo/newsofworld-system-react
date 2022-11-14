import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, notification } from 'antd'
import { DeleteOutlined, EditOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import WithRouter from '../../../components/WithRouter';
import axios from 'axios';
const auditList = ['未审核', '审核中', '已通过', '未通过'];
const colorList = ['black', 'orange', 'green', 'red']
function AuditList(props) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem('token'));

  // 添加_gte(大于)或_lte(小于等于)获取范围   添加_ne(不等于)以排除值==> 必须要在一行上
  useEffect(() => {
    // 请求内容是author=username && auditState!== 0 && publishState <= 1
    axios(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])

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
      title: '审核状态',
      render: (item) => {
        return <Tag color={colorList[item.auditState]} key={item}>{auditList[item.auditState]}</Tag>
      }
    },
    {
      title: '操作',
      // 什么都不写的话会直接获取到这一项
      render: (item) => {
        return <div>
          {
            item.auditState === 1 && <Button size={'large'} icon={<DeleteOutlined />} onClick={()=>handleRervert(item)} >撤销</Button>
          }
          {
            item.auditState === 2 && <Button type='primary' size={'large'} icon={<VerticalAlignTopOutlined />} onClick={()=>handlePublish(item.id)} >发布</Button>
          }
          {
            item.auditState === 3 && <Button danger size={'large'} icon={<EditOutlined />} onClick={()=>handleUpdate(item.id)} >更新</Button>
          }
        </div>
      }
    },
  ];
  // 撤销事件
  const handleRervert = (item) => {
    // 前后端同步
    setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
    axios.patch(`/news/${item.id}`,{
      auditState:0
    }).then(res=>{
      notification.info({
        message: `通知`,
        description:
          `恭喜您，成功撤销,您可以到草稿箱进行查看`,
        placement: 'bottomRight',
      });
    });
  }
  // 更新事件
  const handleUpdate = (id) => {
    props.history.push(`/news-manage/update/${id}`)
  }

  const handlePublish = (id) => {
    axios.patch(`/news/${id}`, {
      'publishState': 2,
      'publishTime':Date.now()
    }).then(res => {
      props.history.push('/publish-manage/published')
      notification.info({
        message: `通知`,
        description:
          `您可以到[发布管理/已经发布]中查看您的新闻`,
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
export default WithRouter(AuditList)