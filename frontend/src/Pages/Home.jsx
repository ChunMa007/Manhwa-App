import {useState, useEffect} from 'react'
import MangaCard from '../Component/MangaCard'
import { getPopularMangas } from '../Service/api'
import { useNavigate } from 'react-router-dom'
import  '../Css/Home.css'


export default function Home({searchQuery}) {
    const [mangas, setMangas] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    
    function handleMangaClick(manga){
        const title = manga.attributes?.title?.en || manga.attributes?.title['ja-ro']
        navigate(`/series/${encodeURIComponent(title)}/${manga.id}`, { state: {manga} })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getPopularMangas()
                setMangas(response.data)
            } catch(err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
    
        fetchData()
    }, [])
    
    return (
        <div className='manga-grid'>
            {mangas.map(manga => {
                const title = manga.attributes?.title?.en || ""
                return (
                    title.toLowerCase().includes(searchQuery.toLowerCase()) && (
                        <div
                            className='manga-card'
                            key={manga.id}
                            onClick={() => handleMangaClick(manga)}
                            style={{cursor: 'pointer'}}
                        >
                            
                            <MangaCard key={manga.id} manga={manga}/>
                        </div>
                    )
                )
            })}
        </div>
    )
}
