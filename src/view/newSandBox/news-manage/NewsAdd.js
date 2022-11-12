import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, message, Form, Input, Select } from 'antd';
import axios from 'axios';
import './css/NewsAdd.css'
const { Step } = Steps
const { Option } = Select
const steps = [
  {
    title: '基本信息',
    content: '新闻标题，新闻分类',
  },
  {
    title: '新闻内容',
    content: '新闻主题内容',
  },
  {
    title: '新闻提交',
    content: '保存草稿或者提交审核',
  },
];

export default function NewsAdd() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);
  const NewsForm = useRef(null)
  const next = () => {
    if(current === 0){
      // 表单校验
      NewsForm.current.validateFields().then(res=>{
        console.log(res);
        setCurrent(current + 1);
      }).catch(error=>{
        console.log(error)
      })
    }else{
      setCurrent(current + 1);
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  useEffect(()=>{
    axios.get('/categories').then(res=>{
      setCategories(res.data)
    })
  },[])
  return (
    <div>
      {/* 页头 */}
      <PageHeader
        className="site-page-header"
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      {/* 步骤条 */}
      <Steps current={current}>
        <Step title="基本信息" description={'新闻标题，新闻分类'} />
        <Step title="新闻内容" description={'新闻主题内容'} />
        <Step title="新闻提交" description={'保存草稿或者提交审核'} />
      </Steps>
      {/* 文本显示 */}
      <div className={current === 0 ? '' : 'active'}>
        <Form
          name="basic"
          // 一共是24份  
          labelCol={{ span: 0 }} // label 会占4  
          wrapperCol={{ span: 20 }} // input 输入框会占 20
          initialValues={{ remember: true }}
          ref={NewsForm} // 校验功能
          autoComplete="off"
          className='form'
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[{ required: true, message: 'Please input your title!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[{ required: true, message: 'Please input your categoryId!' }]}
          >
            <Select>
              {
                categories.map(item=><Option key={item.id} value={item.id}>{item.title}</Option>)
              }
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className={current === 1 ? '' : 'active'}>

      </div>
      <div className={current === 2 ? '' : 'active'}>

      </div>
      {/* 推进按钮 */}
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <><Button style={{ margin: '5px' }} type="primary" onClick={() => message.success('Processing complete!')}>
            保存草稿箱
          </Button>
            <Button danger>提交审核</Button></>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </div>
  )
}
