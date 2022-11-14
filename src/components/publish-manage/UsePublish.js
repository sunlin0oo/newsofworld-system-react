import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
function usePublish(type){
    const [dataSource, setDataSource] = useState([])
    const {username} = JSON.parse(localStorage.getItem('token'))
    useEffect(()=>{
      axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
        console.log('res.data', res.data)
        setDataSource(res.data)
      })
    },[username, type])
    return (
        dataSource
    )
    // 这样返回一个dataSource属性
    // return {
    //     dataSource
    // }
}

export default usePublish