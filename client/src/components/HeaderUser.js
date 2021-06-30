import React, {useState, useEffect} from "react"
import User from "./User"
import "./HeaderUser.css"
import { createRequest } from "../util"
import {MailIcon, XIcon} from '@primer/octicons-react'

function HeaderUser({user, currentUser, provider, efd, refreshUser, refreshCurrentUser}) {
    let [inviteHash, setInviteHash] = useState(undefined)
    let [sendInvite, setSendInvite] = useState(false)
    let [removeFriend, setRemoveFriend] = useState(false) // TODO: Implement remove friend
    
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

    useEffect(() => {
        if (removeFriend) {
            (async () => {
                const tx = await efd.removeAdj(user.address)
                await tx.wait()
                await Promise.all([refreshCurrentUser(), refreshUser()])
                setRemoveFriend(false)
            })()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [removeFriend])

    const mutuals = currentUser ? user.friends.filter(u => currentUser.friends.map(f=>f.address).includes(u.address)) : []

    return <div className="headerUser">
        <div style={{display: "flex"}}>
            <div style={{width: "80%", display: "inline-block"}}>
                <User user={user} addressCopyable={true} miscText={isOwnProfile ? "You" : areFriends ? "Friend" : undefined}></User>
            </div>
            
            {provider && currentUser && !isOwnProfile && !areFriends ? 
            <button className="inviteButton" onClick={() => setSendInvite(true)}><MailIcon/></button> : 
            areFriends ? 
            <button className="inviteButton" onClick={() => setRemoveFriend(true)}><XIcon/></button> : <></>}
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