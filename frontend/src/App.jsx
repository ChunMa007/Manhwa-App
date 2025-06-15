import { useEffect, useState } from 'react'
import Navbar from './Component/Navbar'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import MangaPage from './Pages/MangaPage'

function App() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
      <main className='main-content'>
        <Routes>
          <Route path='/' element={<Home searchQuery={searchQuery}/>}/>
          <Route path='/' element={<Home searchQuery={searchQuery}/>}/>
          <Route path='/series/:title/:id' element={<MangaPage/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
