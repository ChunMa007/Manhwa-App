import React, { useState } from 'react'
import { useEffect } from 'react'
import { getMangaPage } from '../Service/api'
import { useLocation } from 'react-router-dom'
import MangaInfo from '../Component/MangaInfo'
import '../Css/MangaPage.css'

export default function MangaPage() {
    const { state } = useLocation()
    const manga = state?.manga

    const [mangaInfo, setMangaInfo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMangaPage = async () => {
            try {
                const response = await getMangaPage(manga.id)
                setMangaInfo(response)
            } catch(err) {
                console.error("Error while fetching manga page")
            } finally {
                setLoading(false)
            }
        }

        fetchMangaPage()
    }, [manga])
    return (
        <div className='manga-page-container'>
            {loading ? <p>Loading...</p> : <MangaInfo mangaInfo={mangaInfo}/>}
        </div>
    )   
}
