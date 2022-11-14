import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import NewPublish from '../../../components/publish-manage/NewPublish'

export default function Unpublished() {
  const [dataSource, setDataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios.get(`/news?author=${username}&publishState=1&_expand=category`).then(res=>{
      setDataSource(res.data)
    })
  },[username])
  return (
    <div>
      <NewPublish dataSource={dataSource}></NewPublish>
    </div>
  )
}
