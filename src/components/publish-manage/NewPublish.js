import React from 'react'
import { Table} from 'antd'
export default function NewPublish(props) {
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '新闻作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      // 什么都不写的话会直接获取到这一项
      render: (item) => {
        return <div>
          {
            props.button(item.id) // 子串父 点击的id
          }
        </div>
      }
    },
  ];
  return (
    <div>
      {/* 为什么这里不用加rowkey是因为，后端传来的字段，存在key字段，故自动填充上 */}
      <Table dataSource={props.dataSource} columns={columns}
        pagination={{
          pageSize: 4
        }}
        rowKey={item => item.id} />
    </div>
  )
}
