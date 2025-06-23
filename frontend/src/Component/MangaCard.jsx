import {useEffect, useState} from 'react'
import '../Css/MangaCard.css'
import { getMangas } from '../Service/api'

export default function MangaCard({manga}) {
  const style = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginBottom: '0.5rem'
  }

  return (
    <div className='manga-card'>
        <div className='movie-poster'>
              <img src={manga.cover_art}/>
            </div>
            <div className='manga-info'>
              <div className='title-container'>
                <h4 style={style}>{manga.title}</h4>
              </div>
              <div className='status_container'>
                <p>{manga.status}</p>
              </div>
            </div>
    </div>
  )
}
