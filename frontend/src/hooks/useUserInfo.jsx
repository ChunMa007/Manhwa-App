import { useEffect, useState } from "react"
import { ACCESS_TOKEN } from "../constants"

function useUserInfo() {
    const [userInfo, setUserInfo] = useState(null)

    useEffect(() => {
    const access_token = localStorage.getItem(ACCESS_TOKEN)

    const fetchUserImage = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/user/', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                }
            })
            if(response.ok){
                const data = await response.json()
                setUserInfo(data)
            }
        } catch(err) {
            console.error('There was an error: ', err)
        }
    }
    fetchUserImage()
    }, [])

    return userInfo
}

export default useUserInfo