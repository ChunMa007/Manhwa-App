import {useEffect, useState} from 'react'
import '../Css/MangaCard.css'
import { getMangaChapter } from '../Service/api'

export default function MangaCard({manga}) {
    const coverArt = manga.relationships?.find(rel => rel.type === "cover_art")
    const [mangaChapters, setMangaChapters] = useState([])
    const style = {
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginBottom: '0.5rem'
    }

    useEffect(() => {
        const fetchMangaChapter = async () => {
            try {
                const response = await getMangaChapter(manga.id)
                setMangaChapters(response.data)
            } catch(error) {
                console.error("Error fetching manga chapters: ", error)
            }
        }

        fetchMangaChapter()
    }, [])

  return (
    <div className='manga-card'>
        <div className='movie-poster'>
              <img src={`https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`}/>
            </div>
            <div className='manga-info'>
              <h4 style={{ style }}>{manga.attributes.title.en || manga.attributes.title["ja-ro"] || "No Titles Available"}</h4>
              <div className='manga-chapter'>
                <p>Chapters: {mangaChapters.length}</p>
              </div>
            </div>
    </div>
  )
}
