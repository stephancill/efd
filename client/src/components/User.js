import React from "react"
import "./User.css"
import { createIcon } from '@download/blockies';

function truncateAddress(address) {
    address = address.toLowerCase()
    return `${address.slice(0,6)}...${address.slice(address.length-4,address.length)}`
}

export function User({user, onSelectUser, addressCopyable=false, miscText}) {

    var iconURL = createIcon({
        seed: user.address.toLowerCase(),
        size: 15,
        scale: 2
    }).toDataURL()

    return <div className="userItem" onClick={onSelectUser ? () => onSelectUser(user) : () => {}}>
        <div className="profileImage">
        {/* https://stackoverflow.com/a/45212793 */}
        <img alt={user.address} src={user.profileImage ? user.profileImage : iconURL }></img>
        </div>
        <div className="detailContainer">
            <div className="username" title={user.ens}>{user.ens}</div>
            <div style={addressCopyable ? {cursor: "copy"} : {}} className="address" title={user.address}
            onClick={addressCopyable ? () => window.navigator.clipboard.writeText(user.address) : () => {}}
            >{truncateAddress(user.address)}</div>
            {miscText ? <div className="misc">{miscText}</div> : <></>}
        </div>
    </div>
}

export default User