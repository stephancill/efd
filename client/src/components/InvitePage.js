import React, {useEffect, useState} from "react"
import { ethers } from "ethers"
import User from "./User"
import { acceptRequest } from "../util"

export function InvitePage({currentUser, route, userFromAddress, onSelectUser, provider, efd, refreshCurrentUser}) {
    
    const [fromUser, setFromUser] = useState(undefined)
    const [invite, setInvite] = useState(undefined)

    useEffect(() => {
        (async function init() {
            if (!fromUser && currentUser) {
                // TODO: Handle case where user not connected
                try {
                    const inviteJSONString = atob(route.match.params.encodedInvite)
                    const inviteJSON = JSON.parse(inviteJSONString)
                    if (inviteJSON.toAddress !== currentUser.address) {
                        setFromUser(null)
                    }
                    const user = await userFromAddress(inviteJSON.fromAddress)
                    setFromUser(user)
                    setInvite(inviteJSON)
                } catch (error) {
                    console.error(error)
                    setFromUser(null)
                }    
            }
        })()
    }, [currentUser])

    const acceptInvite = async () => {
        try {
            const signature = await acceptRequest(invite.fromAddress, provider.getSigner(currentUser.address), invite.fromSignature, efd)
            setInvite({...invite, toSignature: signature})
        } catch(error) {
            console.error(error)
        }
    }

    const confirmInvite = async () => {
        try {
            await efd.confirmRequest(invite.fromAddress, invite.toAddress, invite.fromSignature, invite.toSignature)
        } catch(error) {
            console.error(error)
        }

        efd.once("Confirmed", (fromAddress, toAddress) => {
            refreshCurrentUser()
        })
    }

    return <div className="card">
        <h2>Invite</h2>
        {currentUser == null ? <div>Not connected</div> : 
        fromUser === undefined ? <div>Loading...</div> : 
        fromUser === null ? <div>Invalid invite</div> : <>
            <User user={fromUser} onSelectUser={onSelectUser} addressCopyable={true}></User>
            <div style={{display: "flex"}} >
                {
                    currentUser.friends.map(u=>u.address.toLowerCase()).includes(fromUser.address.toLowerCase()) ? <>You are already friends</> :
                    invite && invite.toSignature ? 
                    <button onClick={async () => await confirmInvite()}>Confirm</button> : 
                    <>
                    <button onClick={async () => await acceptInvite()}>Accept</button>
                    <button>Ignore</button>
                    </>
                }
            </div>
        </>
        }
    </div>
}

export default InvitePage