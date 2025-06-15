import React from 'react'
import '../Css/MangaInfo.css'

export default function MangaInfo({ mangaInfo }) {
    const TextMuted = { color: 'lightgrey', fontSize: '14px' }

    function CapitalizeText(text) {
        return text.charAt(0).toUpperCase() + text.slice(1)
    }

  return (
    <>
    <div className='info-card'>
        <div className='info-left'>
            <div className='info-cover'>
                <img src={mangaInfo.cover_url} alt={mangaInfo.title} />
            </div>
            <button className='favorite-button'>Add to Favorites</button>
            <div className='info-status'>
                <p>Status</p>
                <p style={TextMuted}>{CapitalizeText(mangaInfo.status)}</p>
            </div>
            <div className='info-type'>
                <p>Type</p>
                <p style={TextMuted}>{CapitalizeText(mangaInfo.type)}</p>
            </div>
        </div>

        <div className='info-right'>
            <h1 className='info-title'>{mangaInfo.title}</h1>
            <div className='info-description'>
                <p style={{ fontWeight: 'bold' }}>Synopsis {mangaInfo.title}</p>
                <p>{mangaInfo.description}</p>
            </div>
            
            <div className='info-credits'>
                <div className='info-author'>
                    <p style={{ fontWeight: 'bold' }}>Author</p>
                    <p>{mangaInfo.author}</p>
                </div>
                
                <div className='info-artist'>
                    <p style={{ fontWeight: 'bold' }}>Artist</p>
                    <p>{mangaInfo.artist}</p>
                </div>
                
                <div className='info-updated'>
                    <p style={{ fontWeight: 'bold' }}>Updated On</p>
                    <p>{mangaInfo.updatedAt}</p>
                </div>
            </div>
            <div className='info-genres'>
                <p style={{ fontWeight: 'bold' }}>Genres</p>
                <div className='genres'>
                    {mangaInfo.genres.map(genre => (
                        <div className='genre' key={genre}>
                            <p>{genre}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    <div className='info-altnames'>
        <span><strong>Keywords: </strong></span>
        {mangaInfo.altTitles.map(altTitle => (
            <span key={altTitle}>{altTitle}, </span>
        ))}
    </div>
    </>
  ) 
}
