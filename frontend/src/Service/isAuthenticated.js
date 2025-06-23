import { jwtDecode } from "jwt-decode"
import { ACCESS_TOKEN } from "../constants"

function userIsAuthenticated() {
    const token = localStorage.getItem(ACCESS_TOKEN)

    if(!token) {
        return false
    }

    try {
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if(tokenExpiration < now) {
            return false
        } else {
            return true
        }
    } catch(err) {
        return false
    }
}

export default userIsAuthenticated