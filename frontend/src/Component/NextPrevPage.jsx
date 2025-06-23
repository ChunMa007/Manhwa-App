import React, { useEffect, useState } from 'react'

export default function NextPrevPage() {
    const [page, setPage] = useState(1)
    const limit = 20
    const offset = limit * page

    useEffect(() => {
        fetch(`http://localhost:8000/api/popular-mangas/?limit=${limit}&offset=${offset}`)
            .then(res => {
                res.json()
            }).then(data => {
                console.log("Data: ", data)
            })
    }, [page])

  return (
    <div>
      
    </div>
  )
}
