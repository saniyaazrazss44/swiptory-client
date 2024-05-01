import React from 'react'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home/Home'
import Bookmarks from './components/Bookmarks/Bookmarks'
import SharePage from './components/SharePage/SharePage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/bookmark' element={<Bookmarks />} />
        <Route path='/view_story/:storyId' element={<SharePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
