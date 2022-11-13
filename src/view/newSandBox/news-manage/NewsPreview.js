import React, { useEffect } from 'react'
import { Button, Descriptions, PageHeader, Tooltip  } from 'antd';
import WithRouter from '../../../components/WithRouter';
import axios from 'axios';
import { useState } from 'react';
import moment from 'moment'
const auditList = ['未审核', '审核中', '已通过', '未通过'];
const publishList = ['未发布', '待发布', '已上线', '已下线'];
function NewsPreview(props) {
    const [newsInfo, setNewsInfo] = useState([])
    useEffect(() => {
        axios.get(`/news/${props.history.match.id}?_expand=category&_expand=role`).then(res => {
            setNewsInfo(res.data);
            console.log('NewsPreview-res.data', res.data)
        })
    }, [props.history.match.id])
    return (
        newsInfo &&
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                // title={newsInfo?.title}
                title={newsInfo.title}
                subTitle="This is a subtitle"
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{moment(newsInfo.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region === '' ? '全球' : newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态" contentStyle={{ color: 'red' }}>{auditList[newsInfo.auditState]}</Descriptions.Item>
                    <Descriptions.Item label="发布状态" contentStyle={{ color: 'red' }}>{publishList[newsInfo.publishState]}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.start}</Descriptions.Item>
                    {/* <Descriptions.Item label="评论数量">{newsInfo}</Descriptions.Item> */}
                </Descriptions>
            </PageHeader>
            <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{border:'solid 2px gray',padding:'24px'}}/>
        </div>
    )
}
export default WithRouter(NewsPreview)