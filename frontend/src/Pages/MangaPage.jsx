import React, { useState } from 'react'
import { useEffect } from 'react'
import { getMangaPage } from '../Service/api'
import { useLocation } from 'react-router-dom'
import MangaInfo from '../Component/MangaInfo'
import '../Css/MangaPage.css'
import { getMangaChapter } from '../Service/api'
import ChapterContainer from '../Component/ChapterContainer'

export default function MangaPage() {
    const { state } = useLocation()
    const manga = state?.manga

    const [mangaInfo, setMangaInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [mangaChapter, setMangaChapter] = useState([])

    useEffect(() => {
        const fetchMangaPage = async () => {
            try {
                const info = await getMangaPage(manga.id)
                setMangaInfo(info)

                const chapter = await getMangaChapter(manga.id)
                setMangaChapter(chapter.data)
            } catch(err) {
                console.error("Error while fetching manga data: ", err)
            } finally {
                setLoading(false)
            }
        }

        fetchMangaPage()
    }, [])

    if(loading) return <p>Loading...</p>

    return (
        <>
            {loading ? <p>Loading...</p> : (
                <div className='manga-page-container'>
                    <MangaInfo mangaInfo={mangaInfo}/>

                    <div className='chapter-header'>
                        <h3>Chapter {mangaInfo.title}</h3>
                    </div>

                    <div className='chapter-container'>
                        <div className='chapter-list'>
                            {mangaChapter.map((manga, index) => <ChapterContainer key={index} manga={manga} title={mangaInfo.title} id={mangaInfo.id} mangaChapter={mangaChapter}/>)}
                        </div>
                    </div>  
                </div>
            )}
        </>
    )   
}
