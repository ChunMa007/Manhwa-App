import {useState, useEffect} from 'react'
import MangaCard from '../Component/MangaCard'
import { useNavigate } from 'react-router-dom'
import NextPrevPage from '../Component/NextPrevPage'
import  '../Css/Home.css'
import { getMangas, searchManga } from '../Service/api'


export default function Home({searchQuery}) {
    const [mangas, setMangas] = useState([])
    const [page, setPage] = useState(1)
    const [totalResult, setTotalResult] = useState(0)
    const limit = 30
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
    const fetchMangas = async () => {
        setLoading(true)
        try {
            if(searchQuery){
                const response = await searchManga(searchQuery, limit, page - 1)
                setMangas(response.data)
                setTotalResult(response.total)
                navigate(`/series/page/${page}/name/${encodeURIComponent(searchQuery)}`)
            } else {
                const response = await getMangas(limit, page - 1)
                setMangas(response.data)
                setTotalResult(response.total)
            }
        } catch(err) {
            console.error("Error: fetching mangas")
        } finally {
            setLoading(false)
        }
    }
    fetchMangas()
    }, [page, searchQuery])

    return (
        <>
            {loading ? <p>Loading...</p> : (
            <div className='manga-container'>  
                <div className='manga-grid'>
                    {mangas.map(manga => {
                        return (
                            <div
                                className='manga-card'
                                key={manga.id}
                                onClick={() => navigate(`/series/${encodeURIComponent(manga.title)}`, { state: {manga} })}
                                style={{ cursor: 'pointer' }}
                            >
                                <MangaCard manga={manga}/>
                            </div>
                        )
                    })}
                </div>

                <div className='button-container'>
                    <button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page===1}>&lt; Prev</button>
                    <label>Page {page}</label>
                    <button onClick={() => setPage(prev => (prev + 1))} disabled={totalResult < limit}>Next &gt;</button>
                </div>
            </div>  
            )}   
        </>   
    )
}
