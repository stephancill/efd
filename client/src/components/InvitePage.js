import React, {useEffect, useState} from "react"
import User from "./User"
import { acceptRequest } from "../util"
import "./InvitePage.css"
import { SpinnerButton } from "./Spinner"

export function InvitePage({currentUser, route, userFromAddress, onSelectUser, provider, efd, refreshCurrentUser, history}) {
    
    let [fromUser, setFromUser] = useState(undefined)
    let [invite, setInvite] = useState(undefined)
    let [errorMessage, setErrorMessage] = useState(undefined)

    let [isAccepting, setIsAccepting] = useState(false)
    let [isConfirming, setIsConfirming] = useState(false)

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
                    // TODO: Extract encode/decode invite code into utils and write tests
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
        setIsAccepting(true)
        try {
            const signature = await acceptRequest(invite.fromAddress, provider.getSigner(currentUser.address), invite.fromSignature, efd)
            setInvite({...invite, toSignature: signature})
        } catch(error) {
            console.error(error)
        }
        setIsAccepting(false)
    }

    const confirmInvite = async () => {
        setIsConfirming(true)
        try {
            const tx = await efd.confirmRequest(invite.fromAddress, invite.toAddress, invite.fromSignature, invite.toSignature)
            await tx.wait()
            refreshCurrentUser()
        } catch(error) {
            console.error(error)
        }
        setIsConfirming(false)
    }

    return <div className="card invite">
        <h2>Invite</h2>
        {currentUser == null ? <div>Not connected</div> : 
        isLoading ? <div>Loading...</div> : 
        // eslint-disable-next-line eqeqeq
        fromUser == null || fromUser == undefined ? <div>Invalid invite</div> : <>
            <User user={fromUser} onSelectUser={onSelectUser} addressCopyable={true}></User>
            <div style={{display: "flex", flexGrow: "1"}} >
                {
                    errorMessage ? errorMessage :
                    invite && invite.toSignature ? 
                    <span><SpinnerButton isSpinning={isConfirming} onClick={async () => await confirmInvite()}>Confirm</SpinnerButton></span> : 
                    <>
                    <SpinnerButton isSpinning={isAccepting} onClick={async () => await acceptInvite()}>Accept</SpinnerButton>
                    <button onClick={() => history.push("/")} className="btnSecondary">Ignore</button>
                    </>
                }
            </div>
        </>
        }
    </div>
}

export default InvitePage