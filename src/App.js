import React from 'react'
import { HashRouter,} from 'react-router-dom'
import './App.css'
import IndexRouter from './router/IndexRouter';
export default function App() {
  return (
      <HashRouter>
        <IndexRouter></IndexRouter>
      </HashRouter>
  )
}
