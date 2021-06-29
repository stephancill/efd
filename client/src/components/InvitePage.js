import React, {useEffect, useState} from "react"
import User from "./User"
import { acceptRequest } from "../util"
import "./InvitePage.css"

export function InvitePage({currentUser, route, userFromAddress, onSelectUser, provider, efd, refreshCurrentUser}) {
    
    const [fromUser, setFromUser] = useState(undefined)
    const [invite, setInvite] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState(undefined)

    let isLoading = fromUser === undefined
    let alreadyFriends = currentUser && fromUser && currentUser.friends.map(u=>u.address.toLowerCase()).includes(fromUser.address.toLowerCase())

    useEffect(() => {
        if (invite) {
            if (invite.toAddress.toLowerCase() !== currentUser.address.toLowerCase()) {
                setErrorMessage("Invite is addressed to a different user")
                return
            }
            if (alreadyFriends) {
                setErrorMessage("You are already friends")
                return
            }
            
            setErrorMessage(undefined)
            return
        }
        (async function init() {
            if (!fromUser && currentUser) {
                try {
                    const inviteJSONString = atob(route.match.params.encodedInvite)
                    const inviteJSON = JSON.parse(inviteJSONString)
                    const user = await userFromAddress(inviteJSON.fromAddress)

                    setFromUser(user)
                    setInvite(inviteJSON)

                    if (inviteJSON.toAddress.toLowerCase() !== currentUser.address.toLowerCase()) {
                        setErrorMessage("Invite is addressed to a different user")
                        return
                    }
                } catch (error) {
                    console.error(error)
                    setFromUser(null)
                    setErrorMessage("Invalid invite")
                }    
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    return <div className="card invite">
        <h2>Invite</h2>
        {currentUser == null ? <div>Not connected</div> : 
        isLoading ? <div>Loading...</div> : 
        fromUser == null || fromUser == undefined ? <div>Invalid invite</div> : <>
            <User user={fromUser} onSelectUser={onSelectUser} addressCopyable={true}></User>
            <div style={{display: "flex", flexGrow: "1"}} >
                {
                    errorMessage ? errorMessage :
                    invite && invite.toSignature ? 
                    <span><button onClick={async () => await confirmInvite()}>Confirm</button></span> : 
                    <>
                    <button onClick={async () => await acceptInvite()}>Accept</button>
                    <button className="btnSecondary">Ignore</button>
                    </>
                }
            </div>
        </>
        }
    </div>
}

export default InvitePage