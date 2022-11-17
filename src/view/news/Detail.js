import React, { useEffect } from 'react'
import { Descriptions, PageHeader } from 'antd';
import Icon, { HeartOutlined } from '@ant-design/icons';
import WithRouter from '../../components/WithRouter';
import axios from 'axios';
import moment from 'moment'
import { useState } from 'react';
function Deatil(props) {
    const [newsInfo, setNewsInfo] = useState([])
    useEffect(() => {
        axios.get(`/news/${props.history.match.id}?_expand=category&_expand=role`).then(res => {
            // Object.entries 转成二维数组
            setNewsInfo({
                ...res.data,
                view: res.data.view + 1

            })
            return res.data
        }).then(res => {
            console.log(res)
            axios.patch(`/news/${props.history.match.id}`, {
                view: res.view + 1
            })
        })
    }, [props.history.match.id]);

    const handleStar = () => {
        setNewsInfo({
            ...newsInfo,
            star: newsInfo.star + 1
        })
        axios.patch(`/news/${props.history.match.id}`, {
            star: newsInfo.star + 1
        })
    }
    return (
        newsInfo &&
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsInfo?.title}
                subTitle={
                    <div>
                        {
                            newsInfo.length === 0?'':newsInfo.category.title
                        }
                        <HeartOutlined style={{ color: 'red', margin: '5px' }} onClick={()=>handleStar()}/>
                    </div>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region === '' ? '全球' : newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                    {/* <Descriptions.Item label="评论数量">{newsInfo}</Descriptions.Item> */}
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ border: 'solid 2px gray', padding: '24px' }} />
        </div>
    )
}
export default WithRouter(Deatil)
