import { Link } from 'react-router-dom'
import '../Css/Navbar.css'

export default function Navbar({searchQuery, setSearchQuery}) {
    
    return (
        <nav className='navbar'>
            <div className='logo'>
                <Link to='/'>Chunma007</Link>
            </div>
            <ul className='nav-links'>
                <li><Link to='/'>Home</Link></li>
                <li><a href="">Favorites</a></li>
                <li><a href="">Comics</a></li>
                <li><a href="">About Us</a></li>
            </ul>
            <div className='search-form'>
                <input 
                    type="text"
                    placeholder='Search...'
                    className='search-input'
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
                <button>Login</button>
            </div>
        </nav>
    )
}
