import React, { useEffect, useState } from 'react'
import { getMangaChapter, getMangaChapterImage } from '../Service/api'
import { replace, useLocation, useNavigate, useParams } from 'react-router-dom'
import ChapterImage from '../Component/ChapterImage'
import '../Css/MangaReadPage.css'

export default function MangaReadPage() {
    const { state } = useLocation()
    const chapter = state?.manga
    const manga_id = state?.id

    const { title } = useParams()

    const [chapterImages, setChapterImages] = useState([])
    const [loading, setLoading] = useState(false)

    const [chapterList, setChapterList] = useState([])
    const [currentChapterIndex, setCurrentChapterIndex] = useState(null)
    const [currentChapterNumber, setCurrentChapterNumber] = useState(null)

    const navigate = useNavigate()
    
    useEffect(() => {
        const fetchChapterIndex = async () => {
            try {
                const chapterResult = await getMangaChapter(manga_id)
                const chapters = chapterResult.data
                setChapterList(chapters)

                const currentIndex = chapters.findIndex(chap => chap.id === chapter.id)
                setCurrentChapterIndex(currentIndex)

            } catch(err) {
                console.error("Error Fetching Chapters")
            }
        }

        fetchChapterIndex()
    }, [])

    useEffect(() => {
        setLoading(true)

        const fetchChapterImages = async () => {
            if(currentChapterIndex !== null && chapterList.length > 0) {
                try {
                    const currentIndex = currentChapterIndex
                    const chapters = chapterList[currentIndex]
                    const chapterImages = await getMangaChapterImage(chapters.id)
                    setChapterImages(chapterImages.data)
                    setCurrentChapterNumber(chapters.chapter)
                    setCurrentChapterIndex(currentIndex)
                } catch(err) {
                    console.error("Error Fetching Manga Images")
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchChapterImages()
    }, [currentChapterIndex, chapterList])

    return (
        <>
            {loading ? <p>Loading...</p> : (
                <div className='manga-read-page-container'>
                    <div className='manga-read-header'>
                        <h1>{title} Chapter {currentChapterNumber}</h1>
                    </div>

                    <div className='nextprev-button'>
                        <button 
                            onClick={() => setCurrentChapterIndex(current => current - 1)}
                            disabled={currentChapterIndex === 0}
                        >Previous</button>

                        <button 
                            onClick={() => setCurrentChapterIndex(current => current + 1)} 
                            disabled={currentChapterIndex === chapterList.length - 1}
                        >Next</button>
                    </div>

                    <div className='manga-read-body'>
                        {chapterImages.map((image, index) => <img src={image} key={index} />
                            
                        )}
                    </div>
                </div>
            )}
        </>

    )
}
