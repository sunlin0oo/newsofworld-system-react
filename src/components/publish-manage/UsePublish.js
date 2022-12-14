import axios from 'axios'
import { useState, useEffect } from 'react'
import { notification } from 'antd';

function usePublish(type) {
    const [dataSource, setDataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
            // console.log('res.data', res.data)
            setDataSource(res.data)
        })
    }, [username, type])
    const handlePublish = (id) => {
        // console.log('handlePublish', id)
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now(),
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到[发布管理/已经发布]中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }
    const handleSunset = (id) => {
        // console.log('handleSunset', id)
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以到[发布管理/已下线]中查看您的新闻`,
                placement: 'bottomRight',
            });
        })
    }
    const handleDelete = (id) => {
        // console.log('handleDelete', id)
        setDataSource(dataSource.filter(item => item.id !== id));
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您已经删除了已下线的新闻`,
                placement: 'bottomRight',
            });
        })
    }
    // 这样直接导出数值
    // return (
    //     handleDelete,
    //     handleSunset,
    //     handlePublish,
    //     dataSource
    // )
    // 这样返回一个dataSource属性
    return {
        dataSource,
        handleDelete,
        handleSunset,
        handlePublish
    }
}

export default usePublish