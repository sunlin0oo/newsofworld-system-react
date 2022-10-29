import React, { useEffect } from 'react'
import Child from './Child'
import './App.css'
import axios from 'axios'
export default function App() {
  useEffect(()=>{
    axios.get(
      '/ajax/comingList?ci=1&limit=10&movieIds=&token=&optimus_uuid=B0CC71C096A911EBA609453370FBFE2C59BC3AF5D61A4344A1A7C05FABCF4D21&optimus_risk_level=71&optimus_code=10'
      ).then((res)=>{
        console.log(res.data)
      })
  },[])
  return (
    <div>
      <ul>
        <li className='item'>1111111111</li>
        <li className='item'>2222222222</li>
      </ul>
      <Child></Child>
      </div>
  )
}
