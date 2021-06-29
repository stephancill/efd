import React, {useState, useEffect} from "react"
import User from "./User"
import "./HeaderUser.css"
import { createRequest } from "../util"

function HeaderUser({user, currentUser, provider, efd}) {
    let [inviteHash, setInviteHash] = useState(undefined)
    let [sendInvite, setSendInvite] = useState(false)
    
    let isOwnProfile = currentUser && user.address.toLowerCase() === currentUser.address.toLowerCase()
    let areFriends = currentUser && currentUser.friends.map(u=>u.address.toLowerCase()).includes(user.address.toLowerCase())

    useEffect(() => {
        if (sendInvite) {
            (async () => {
                let hash
                try {
                    hash = await createRequest(provider.getSigner(0), user.address, efd)
                } catch (error) {
                    console.error(error)
                    setSendInvite(false)
                    return
                }

                const inviteJSON = {
                    fromAddress: currentUser.address,
                    toAddress: user.address,
                    fromSignature: hash
                }

                const inviteJSONString = JSON.stringify(inviteJSON)
                const encodedInvite = btoa(inviteJSONString)
                
                const url = `${window.location.host}/invite/${encodedInvite}`

                console.log(url) // TODO: Copy this to the clipboard and display somewhere 

                setInviteHash(hash)
                setSendInvite(false)
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendInvite])

    const mutuals = currentUser ? user.friends.filter(u => currentUser.friends.map(f=>f.address).includes(u.address)) : []

    return <div>
        <div style={{display: "flex"}}>
            <User user={user} addressCopyable={true}></User>
            {provider && currentUser && !isOwnProfile && !areFriends ? 
            <button onClick={() => setSendInvite(true)}>Invite</button> : <></>}
        </div>
        
        <div className="headerDetailContainer">
            <span>{`${user.friends.length} friends`}</span>
            {
                currentUser ? <span style={{marginLeft: "10px"}}>{currentUser ? `${mutuals.length} mutual` : ""}</span> : <></>
            }
        </div>
        
    </div>
}

export default HeaderUser