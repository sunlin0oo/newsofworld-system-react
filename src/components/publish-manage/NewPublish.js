import React from 'react'
import { Table, Button, Modal,} from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
const { confirm } = Modal;
export default function NewPublish(props) {
    const columns = [
      {
        title: '新闻标题',
        dataIndex: 'title',
        key: 'title',
        render:(title,item) => {
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
        render:(category) => {
            return <div>{category.title}</div>
        }
      },
      {
        title: '操作',
        // 什么都不写的话会直接获取到这一项
        render: (item) => {
          return <div>
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
        // setDataSource(dataSource.filter(data => data.id !== item.id));// 过滤出与删除的id不相同的数据
        // 在处理后端
        axios.delete(`/categories/${item.id}`)
    }
  
  
    return (
      <div>
        {/* 为什么这里不用加rowkey是因为，后端传来的字段，存在key字段，故自动填充上 */}
        <Table dataSource={props.dataSource} columns={columns}
          pagination={{
            pageSize: 4
          }}
          rowKey={item => item.id}/>
      </div>
    )
}
