import React from 'react'
import NewPublish from '../../../components/publish-manage/NewPublish'
import usePublish from '../../../components/publish-manage/UsePublish'
import { Button} from 'antd'

export default function Sunset() {
  const {dataSource, handleDelete} = usePublish(3)
  return (
    <div>
      <NewPublish dataSource={dataSource} button={(id)=><Button danger
      onClick={()=>handleDelete(id)}>删除</Button>}></NewPublish>
    </div>
  )
}
