import React from 'react'
import NewPublish from '../../../components/publish-manage/NewPublish'
import usePublish from '../../../components/publish-manage/UsePublish'
import { Button} from 'antd'

export default function Unpublished() {
  // const [dataSource, setDataSource] = useState([])
  // const {username} = JSON.parse(localStorage.getItem('token'))
  // useEffect(()=>{
  //   axios.get(`/news?author=${username}&publishState=1&_expand=category`).then(res=>{
  //     setDataSource(res.data)
  //   })
  // },[username])
  const {dataSource, handlePublish} = usePublish(1)
  return (
    <div>
      <NewPublish dataSource={dataSource} button={(id)=><Button type='primary'
      onClick={()=>handlePublish(id)}>发布</Button>}></NewPublish>
    </div>
  )
}
