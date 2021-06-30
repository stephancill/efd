import React, {useState, useEffect} from "react"
import User from "./User"
import "./HeaderUser.css"
import { createRequest } from "../util"
import { MailIcon, XIcon, LinkIcon } from '@primer/octicons-react'
import ReactModal from "react-modal"
import qr from "qr-image"

ReactModal.setAppElement("#root")

function svgStringToBlob(string) {
    const blob = new Blob([string], {type: 'image/svg+xml'})
    return URL.createObjectURL(blob)
}

function HeaderUser({user, currentUser, provider, efd, refreshUser, refreshCurrentUser}) {
    let [inviteURL, setInviteURL] = useState(undefined)
    let [shouldShowModal, setShouldShowModal] = useState(false)
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
                
                const url = `${window.location.protocol}//${window.location.host}/invite/${encodedInvite}`

                console.log(url)

                setInviteURL(url)
                setShouldShowModal(true)
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

        {
            
            inviteURL ? 
            <ReactModal
                isOpen={inviteURL && shouldShowModal}
                onRequestClose={() => setShouldShowModal(false)}
                className={"sendInviteModal"}
                overlayClassName={"sendInviteModalOverlay"}
            >
                <h2>Send Invite</h2>
                <div style={{display: "flex", alignItems: "center"}}>
                    <span>Ask</span>
                    <User user={user} inline={true}></User>
                    <span>to scan:</span> 
                </div>
                <img className="qrImage" src={svgStringToBlob(qr.imageSync(inviteURL, { type: 'svg' })) }></img>
                <div className="linkContainer">
                    <span>Or send them this link:</span>
                    <input readOnly={true} value={inviteURL} onClick={(event) => event.target.setSelectionRange(0, event.target.value.length)}/>
                    <button onClick={() => window.navigator.clipboard.writeText(inviteURL)}><LinkIcon/></button> {/* TODO: A nice "Copied" tooltip */}
                </div>
            </ReactModal> : <></>
        }
    </div>
}

export default HeaderUser