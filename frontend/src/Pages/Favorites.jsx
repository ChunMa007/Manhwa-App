import { useEffect, useState } from "react"
import userIsAuthenticated from "../Service/isAuthenticated"
import { ACCESS_TOKEN } from "../constants"
import MangaCard from "../Component/MangaCard"
import { useNavigate } from "react-router-dom"

function Favorites() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [favoriteManga, setFavoriteManga] = useState([])

    useEffect(() => {
        const access_token = localStorage.getItem(ACCESS_TOKEN)

        const fetchFavoriteManga = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user-favorites/', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${access_token}`
                    }
                })

                const data = await response.json()

                if(response.ok) {
                    setFavoriteManga(data)
                }
            } catch(err) {
                console.error("Error fetching favorite manga: ", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFavoriteManga()
    }, [])

    async function handleRemoveFavorite(e, manga_id) {
        e.stopPropagation()

        const access_token = localStorage.getItem(ACCESS_TOKEN)

        try {
            const response = await fetch(`http://localhost:8000/api/user-favorites/${manga_id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            })

            if(response.ok) {
                setFavoriteManga(prev => 
                    prev.filter(manga => manga.id !== manga_id)
                )
            }

        } catch(err) {
            console.error("Error removing favorite: ", err)
        }
    }

    return (
        <>
            {isLoading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : favoriteManga.length === 0 ? (
                <div>
                    <h1 style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}>No Favorites Manga</h1>
                </div>
            ) : (
                <div className='manga-container'>  
                    <div className='manga-grid'>
                        {favoriteManga.map(manga => {
                            return (
                                <div
                                    className='manga-card'
                                    key={manga.id}
                                    onClick={() => navigate(`/series/${encodeURIComponent(manga.title)}`, { state: {manga} })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <MangaCard manga={manga}/>

                                    <button
                                        className="remove-button"
                                        onClick={(e) => handleRemoveFavorite(e, manga.id)}
                                    >X</button> 
                                </div>
                            )
                        })}
                    </div>
                </div>  
            )}
        </> 
    )
}

export default Favorites