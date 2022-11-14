import React from 'react'
import NewPublish from '../../../components/publish-manage/NewPublish'
import usePublish from '../../../components/publish-manage/UsePublish'
import { Button} from 'antd'

export default function Unpublished() {
  const {dataSource, handleSunset} = usePublish(2)

  return (
    <div>
      <NewPublish dataSource={dataSource} button={(id)=><Button danger
      onClick={()=>handleSunset(id)}>下线</Button>}></NewPublish>
    </div>
  )
}
