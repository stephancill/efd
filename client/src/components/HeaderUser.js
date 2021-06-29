import React, {useState, useEffect} from "react"
import User from "./User"
import "./HeaderUser.css"
import { createRequest } from "../util"
import { ethers } from "ethers"

function HeaderUser({user, currentUser, provider, efd}) {
    let [inviteHash, setInviteHash] = useState(undefined)
    let [sendInvite, setSendInvite] = useState(false)

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
    }, [sendInvite])

    const mutuals = currentUser ? user.friends.filter(u => currentUser.friends.map(f=>f.address).includes(u.address)) : []

    return <div>
        <div style={{display: "flex"}}>
            <User user={user} addressCopyable={true}></User>
            {provider ? 
            <button onClick={() => setSendInvite(true)}>
                Invite
            </button> : <></>}
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