import { useEffect, useState } from 'react'
import Navbar from './Component/Navbar'
import './App.css'
import {Routes, Route} from 'react-router-dom'
import Home from './Pages/Home'
import MangaPage from './Pages/MangaPage'
import MangaReadPage from './Pages/MangaReadPage'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Favorites from './Pages/Favorites'
import Settings from './Pages/settings'

function App() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div>
      <Navbar setSearchQuery={setSearchQuery}/>
      <main className='main-content'>
        <Routes>
          <Route path='/series/page/:pageNumber/name/:mangaName' element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}/>
          <Route path='/series/:title/chapter/:chapter' element={<MangaReadPage/>}/>
          <Route path='/series/:title/' element={<MangaPage/>}/>

          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/' element={<Home searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>}/>\
          <Route path='/favorites' element={<Favorites/>}/>
          <Route path='/settings' element={<Settings/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
