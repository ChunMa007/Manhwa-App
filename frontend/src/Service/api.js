const BASE_API_URL = 'http://127.0.0.1:8000/api/'

export const searchManga = async (query, limit, page) => {
    try {
        const response = await fetch(`${BASE_API_URL}search/${encodeURIComponent(query)}/?limit=${limit}&offset=${page * limit}`)
        if(!response.ok){
            throw new Error("Failed to fetch manga")
        }
        return await response.json()
    } catch(err) {
        console.error("Error searching manga")
        throw err
    }
}

export const getMangas = async (limit, page) => {
    try {
        const response = await fetch(`${BASE_API_URL}popular-mangas?limit=${limit}&offset=${page * limit}`)
        if (!response.ok) {
            throw new Error("Failed to fetch manga")
        }
        return await response.json()
    } catch(err) {
        console.log("Failed to fetch popular mangas")
        throw err
    }
}

export const getMangaChapter = async (mangaId) => {
    try {
        const response = await fetch(`${BASE_API_URL}manga-chapters/${mangaId}/`)
        if(!response.ok) throw new Error("Failed to fetch chapters")
        return await response.json()
    } catch(err) {
        console.error("Error fetching chapters: ", err)
        throw err
    }
}

export const getMangaPage = async (mangaId) => {
    try {
        const response = await fetch(`${BASE_API_URL}manga/${mangaId}`)
        console.log(response)
        if(!response.ok) throw new Error("Failed to fetch manga")
        return await response.json()
    } catch(err) {
        console.error("Error: while fetching manga")
        throw err
    }
}

export const getMangaChapterImage = async (chapterId) => {
    try {
        const response = await fetch(`${BASE_API_URL}chapter/${chapterId}`)
        if(!response.ok) throw new Error("Failed to fetch chapter images")
        return await response.json()
    } catch(err) {
        console.error("Error: while fetching chapter images")
        throw err
    }
}