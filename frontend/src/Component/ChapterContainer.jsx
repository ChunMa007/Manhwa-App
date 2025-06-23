import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../Css/ChapterContainer.css'

export default function ChapterContainer({manga, title, id, mangaChapter}) {
    const navigate = useNavigate()

    function clickChapter(manga) {
        navigate(`/series/${encodeURIComponent(title)}/chapter/${manga.chapter}`, { state: {manga, title, id, mangaChapter} })
    }

  return (
    <div >
        <div 
            className='chapter'
            onClick={() => clickChapter(manga)} 
        >
            <h4>Chapter {manga.chapter} {manga.chapter_title}</h4>
        </div>
        
    </div>
  )
}
