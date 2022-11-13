import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Steps, Button, message, Form, Input, Select, notification } from 'antd';
import NewsEditor from '../../../components/news-manage/NewsEditor'
import axios from 'axios';
import WithRouter from '../../../components/WithRouter';
import './css/NewsAdd.css'
const { Step } = Steps
const { Option } = Select
function NewsAdd(props) {
    const [current, setCurrent] = useState(0);
    const [categories, setCategories] = useState([]);
    const [formInfo, setFormInfo] = useState('');
    const [content, setContent] = useState('');
    const NewsForm = useRef(null);

    // 下一步所触发事件
    const next = () => {
        if (current === 0) {
            // 表单校验
            NewsForm.current.validateFields().then(res => {
                setFormInfo(res)
                setCurrent(current + 1);
            }).catch(error => {
                console.log(error)
            })
        } else {
            // 避免为空跳转下一步
            // trim去掉首尾空格
            if (content === '' || content.trim() === '<p></p>') {
                message.error('输入错误，请重新输入')
            } else {
                setCurrent(current + 1);
            }
        }
    };
    // 返回上一步
    const prev = () => {
        setCurrent(current - 1);
    };
    // 获取新闻类别的数据
    useEffect(() => {
        axios.get('/categories').then(res => {
            setCategories(res.data)
        })
    }, []);
    // 获取草稿数据
    useEffect(() => {
        axios.get(`/news/${props.history.match.id}?_expand=category&_expand=role`).then(res => {
            console.log('NewsUpdate-res.data', res.data);
            let {title, categoryId, content} = res.data
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })
            setContent(content);
        })
    }, [props.history.match.id])

    // 保存表单内容
    const handleSave = (auditState) => {
        axios.patch(`/news/${props.history.match.id}`, {
            ...formInfo,
            "content": content,
            // 0 草稿箱 1 审核待审核 2 审核通过 3 审核失败
            "auditState": auditState,
            "publishState": 0,
            // "publishTime": 0,
        }).then(res => {
            props.history.push(auditState ? '/audit-manage/list' : '/news-manage/draft')
            notification.info({
                message: `通知`,
                description:
                    `恭喜您，成功${auditState ? '提交审核' : '保存草稿箱'},您可以到${auditState ? '审核列表' : '草稿箱'}进行查看`,
                placement: 'bottomRight',
            });
        })
    }

    return (
        <div>
            {/* 页头 */}
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                subTitle="This is a subtitle"
                onBack={() => window.history.back()}
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
                    ref={NewsForm} // 子传父，可以拿到Form的相关函数及方法，对Form进行函数应用
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
                                categories.map(item => <Option key={item.id} value={item.id}>{item.title}</Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className={current === 1 ? '' : 'active'}>
                {/* 富文本回调函数，获得输入值 */}
                <NewsEditor getContent={(value) => {
                    // console.log(value);
                    setContent(value);
                }} content={content}></NewsEditor>
            </div>
            <div className={current === 2 ? '' : 'active'}>

            </div>

            {/* 推进按钮 */}
            <div className="steps-action">
                {current < 2 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {/* 提交按钮 */}
                {current === 2 && (
                    <>
                        <Button style={{ margin: '5px' }} type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </>
                )}
                {/* 返回按钮 */}
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
export default WithRouter(NewsAdd)