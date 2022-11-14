import axios from 'axios'
import { useState, useEffect } from 'react'
function usePublish(type){
    const [dataSource, setDataSource] = useState([])
    const {username} = JSON.parse(localStorage.getItem('token'))
    useEffect(()=>{
      axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
        // console.log('res.data', res.data)
        setDataSource(res.data)
      })
    },[username, type])
    const handlePublish = (id) =>{
        console.log('handlePublish', id)
    }
    const handleSunset = (id) =>{
        console.log('handleSunset', id)
    }
    const handleDelete = (id) =>{
        console.log('handleDelete', id)
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