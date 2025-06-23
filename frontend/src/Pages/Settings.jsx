import { useEffect, useState } from 'react'
import '../Css/Settings.css'
import useUserInfo from '../hooks/useUserInfo'
import { ACCESS_TOKEN } from '../constants'

export default function Settings() {
    const userInfo = useUserInfo()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [profile, setProfile] = useState(null)

    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")

    useEffect(() => {
        if(userInfo) {
            setUsername(userInfo.username)
            setEmail(userInfo.email)
            setFirstName(userInfo.first_name)
            setLastName(userInfo.last_name)
            setProfile(userInfo.profile)
        }
    }, [userInfo])

    async function handleChangeInfo() {
        const access_token = localStorage.getItem(ACCESS_TOKEN)
        const formData = new FormData()

        formData.append('username', username)
        formData.append('email', email)
        formData.append('first_name', first_name)
        formData.append('last_name', last_name)

        if(profile instanceof File) {
            formData.append('profile', profile)
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/', {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${access_token}`
                },
                body: formData
            })

            if(response.ok) {
                const data = await response.json()
                setUsername(data.username);
                setEmail(data.email);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setProfile(data.profile);
                alert("Changes saved successfully");
            }
        } catch(err) {
            console.error("There was a problem changing the data:", err);
        }
    }

    
    async function handleDeleteProfile(e) {
        e.preventDefault()

        const access_token = localStorage.getItem(ACCESS_TOKEN)

        try {
            const response = await fetch("http://localhost:8000/api/user/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({ reset_profile: 'true' })
            })

            if(response.ok){
                const data = await response.json()
                setProfile(data.profile)
                alert("Profile reset successfully")
            }
        } catch(err) {
            console.err("Error resetting profile")
        }
    }

    async function handleChangePassword(e) {
        e.preventDefault()
        const access_token = localStorage.getItem(ACCESS_TOKEN)

        try {
            const response = await fetch('http://127.0.0.1:8000/api/user/change-password/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    "old_password": oldPassword,
                    "new_password": newPassword,
                    "confirm_new_password": confirmNewPassword
                })
            })

            const data = await response.json()

            if(response.ok){
                setOldPassword("")
                setNewPassword("")
                setConfirmNewPassword("")
                alert("Password changed successfully")
            } else {
                setOldPassword("")
                setNewPassword("")
                setConfirmNewPassword("")
                alert(data.message)
            }
        } catch(err) {
            console.error("There was an error changing password", err)
        }
    }

    return (
        <>
            {userInfo ? (
            <div className='settings-container'>
                <form onSubmit={handleChangeInfo} encType='multipart/form-data'>
                    <div className="settings-wrapper">
                        <div className="settings-top">
                            <div className="profile-image-section">
                                <img src={profile} alt="Profile" className="profile-img" />
                            </div>

                            <div className="profile-actions-section">
                                <div className="button-row">
                                    <label className="btn change-btn" htmlFor='change-profile'>CHANGE PHOTO</label>
                                    <label className="btn delete-btn" onClick={(e) => handleDeleteProfile(e)}>DELETE PHOTO</label>
                                    <input 
                                        type="file" 
                                        id='change-profile' 
                                        accept='image/*' 
                                        style={{ display: "none" }} 
                                        onChange={(e) => setProfile(e.target.files[0])}
                                    />
                                </div>
                                <small className="note">Allowed JPG or PNG. Max size of 2MB</small>
                            </div>
                        </div>

                        <div className="user-info-section">
                            <label>Username:</label>
                            <input 
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>First Name:</label>
                            <input 
                                type="text"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <label>Last Name:</label>
                            <input 
                                type="text"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <button className="save-btn">SAVE CHANGES</button>
                        </div>
                    </div>
                </form>
                
                <form onSubmit={(e) => handleChangePassword(e)}>
                    <div className='change-password-container'>
                        <h3>Change Password</h3>
                        <div className='current-password'>
                            <input 
                                type="password"
                                placeholder='Current Password'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>
                        <div className='new-password'>
                            <input 
                                type="password"
                                placeholder='New Password'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <input 
                                type="password"
                                placeholder='Confirm Password'
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>
                        
                        <div className='help-text'>
                            <strong>Password Requirements</strong>
                            <li>Minimum 8 characters long - the more, the better</li>
                            <li>At least one lowercase character</li>
                            <li>At least one number, symbol, or whitespace character</li>
                        </div>
                        <button type='submit' className='pass-save-btn'>SAVE CHANGES</button>
                    </div>
                </form>
            </div>
            ) : (
                <p>Loading...</p>
            )}
        </>
    )
}
