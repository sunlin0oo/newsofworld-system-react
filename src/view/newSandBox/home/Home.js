import React, { useEffect, useRef, useState } from 'react'
import { Card, Col, List, Row, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'
import  * as Echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
  const [dataViewSource, setDataViewSource] = useState([]);
  const [dataStarSource, setDataStarSource] = useState([]);
  // 解决了跨域问题==>基于node进行处理
  // const ajax=()=>{
  //   // 取数据
  //   // http://localhost:8000/posts/1 会直接拿到id = 1 的信息
  //   // axios.get('http://localhost:8000/posts/1').then(res=>{
  //   //   console.log(res.data);
  //   // })

  //   // 增数据
  //   // axios.post('http://localhost:8000/posts/',{
  //   //   title: "moon", 
  //   //   author: "maoli"
  //   // }).then(res=>{
  //   //   console.log(res.data);
  //   // })

  //   // 改数据--会全局更新，没有写的属性会被丢弃掉
  //   // axios.put('http://localhost:8000/posts/1',{
  //   //   title: "json-server-change", 
  //   //   author: "typicode-change"
  //   // }).then(res=>{
  //   //   console.log(res.data);
  //   // })

  //   // 更新 patch==>局部更新
  //   // axios.patch('http://localhost:8000/posts/1',{
  //   //   title: "json-server-change", 
  //   // }).then(res=>{
  //   //   console.log(res.data);
  //   // })

  //   // 删除==>存在表关联的情况==>posts 与 postId进行关联(类似sunlins 对应下级表  sunlinId)
  //   // axios.delete('http://localhost:8000/posts/1')

  //   // 高级功能
  //   // _embed=comments(数组名字)==>进行表关联的功能==>向下关联
  //   // axios.get('http://localhost:8000/posts?_embed=comments').then(res=>{
  //   //   console.log(res.data)
  //   // })

  //   // _expand 向上关联==>将关联的内容跟放入到json中
  //   axios.get('http://localhost:8000/comments?_expand=post').then(res=>{
  //     console.log(res.data)
  //   })
  // }
  // 获取到降序的访问数
  useEffect(()=>{
    axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(res=>{
      setDataViewSource(res.data)
    })
  },[]);
  // 获取到降序的点赞数
  useEffect(()=>{
      axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(res=>{
        console.log(res.data)
        setDataStarSource(res.data)
      })
    },[]);

  const barRef = useRef()
    useEffect(()=>{
      // 所有发布的新闻
      axios.get('/news?publishState=2&_expand=category').then(res=>{
        // console.log(_.groupBy((res.data),item=>item.category.title)) // 以category.title进行分组
        renderBarView(_.groupBy((res.data),item=>item.category.title))
      })
    },[])
  const renderBarView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj)
      },
      yAxis: {},
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item=>item.length)
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  }

  const {username,region , role:{roleName}} = JSON.parse(localStorage.getItem('token'))
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              dataSource={dataViewSource}
              renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              dataSource={dataStarSource}
              renderItem={item => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            // style={{
            //   width: 350,
            // }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
            bordered={true}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region?region:'全球'}</b>
                  <span style={{padding:'30px'}}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div ref={barRef}id="main" style={{width:'90%',height:'400px', marginTop:'30px'}}></div>
    </div>
    
  )
}
