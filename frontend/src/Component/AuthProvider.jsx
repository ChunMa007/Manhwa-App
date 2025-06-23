import { createContext, useEffect, useState } from "react"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { jwtDecode } from "jwt-decode"

export const AuthContext = createContext()

function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const refreshToken = async () => {
        const refresh = localStorage.getItem(REFRESH_TOKEN)

        if(!refresh){
            setIsAuthenticated(false)
            return
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh })
            })

            const data = await response.json()

            

            if(response.ok) {
                localStorage.setItem(ACCESS_TOKEN, data.access)
                setIsAuthenticated(true)
            } else {
                setIsAuthenticated(false)
            }
        } catch(err) {
            console.error(err)
            setIsAuthenticated(false)
        }
    }

    const checkAuth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        if(!token){
            setIsAuthenticated(false)
            return
        }

        try {
            const decoded = jwtDecode(token)
            const tokenExpiration = decoded.exp
            const now = Date.now() / 1000

            if(tokenExpiration < now) {
                await refreshToken()
            } else {
                setIsAuthenticated(true)
            }
        } catch(err) {
            console.error("Invalid token", err)
            setIsAuthenticated(false)
        }
    }

    useEffect(() => {
        checkAuth()

        const interval = setInterval(checkAuth, 30 * 1000)
        return () => clearInterval(interval)
    }, [])


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider