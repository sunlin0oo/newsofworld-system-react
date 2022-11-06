import React from 'react'
import { Button } from 'antd'
import axios from 'axios'
export default function Home() {
  // 解决了跨域问题==>基于node进行处理
  const ajax=()=>{
    // 取数据
    // http://localhost:8000/posts/1 会直接拿到id = 1 的信息
    // axios.get('http://localhost:8000/posts/1').then(res=>{
    //   console.log(res.data);
    // })

    // 增数据
    // axios.post('http://localhost:8000/posts/',{
    //   title: "moon", 
    //   author: "maoli"
    // }).then(res=>{
    //   console.log(res.data);
    // })

    // 改数据--会全局更新，没有写的属性会被丢弃掉
    // axios.put('http://localhost:8000/posts/1',{
    //   title: "json-server-change", 
    //   author: "typicode-change"
    // }).then(res=>{
    //   console.log(res.data);
    // })

    // 更新 patch==>局部更新
    // axios.patch('http://localhost:8000/posts/1',{
    //   title: "json-server-change", 
    // }).then(res=>{
    //   console.log(res.data);
    // })

    // 删除==>存在表关联的情况==>posts 与 postId进行关联(类似sunlins 对应下级表  sunlinId)
    // axios.delete('http://localhost:8000/posts/1')

    // 高级功能
    // _embed=comments(数组名字)==>进行表关联的功能==>向下关联
    // axios.get('http://localhost:8000/posts?_embed=comments').then(res=>{
    //   console.log(res.data)
    // })

    // _expand 向上关联==>将关联的内容跟放入到json中
    axios.get('http://localhost:8000/comments?_expand=post').then(res=>{
      console.log(res.data)
    })
  }
  return (
    <div>
      <Button type='primary' onClick={ajax}>获取数据</Button>
    </div>
  )
}
