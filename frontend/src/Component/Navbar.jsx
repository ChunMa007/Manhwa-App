import { Link, Navigate, useNavigate } from 'react-router-dom'
import '../Css/Navbar.css'
import { useEffect, useRef, useState } from 'react'
import userIsAuthenticated from '../Service/isAuthenticated'
import { ACCESS_TOKEN } from '../constants'
import DropDownProfile from './DropDownProfile'

export default function Navbar({setSearchQuery}) {
    const [userImage, setUserImage] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const searchRef = useRef()

    function clickHome(){
        setSearchQuery("")
    }

    function handleFavorites(e) {
        e.preventDefault()

        if(userIsAuthenticated()) {
            navigate('/favorites')
        } else {
            alert("You must be logged in to access favorites")
            navigate('/login')
        }
    }

    function handleKeyDown(e) {
        if(e.key === 'Enter'){
            setSearchQuery(searchRef.current.value)

            searchRef.current.value = ""
        }
    }

    function handleLogin() {
        navigate('/login')
    }

    return (
        <nav className='navbar'>
            <div className='logo'
                onClick={clickHome}
            >
                <Link to='/'>Chunma007</Link>
            </div>
            <ul className='nav-links'>
                <li><Link to='/'>Home</Link></li>
                <li><a onClick={handleFavorites}>Favorites</a></li>
                <li><a href="">Comics</a></li>
                <li><a href="">About Us</a></li>
            </ul>
            <div className='search-form'>
                <input 
                    type="text"
                    placeholder='Search...'
                    className='search-input'
                    ref={searchRef}
                    onKeyDown={handleKeyDown}
                />
                {!userIsAuthenticated() ? 
                   <button onClick={handleLogin}>Login</button> : <DropDownProfile />
                }
                
            </div>
        </nav>
    )
}
