import React from "react"
import "./User.css"
import { createIcon } from '@download/blockies';

function truncateAddress(address) {
    address = address.toLowerCase()
    return `${address.slice(0,6)}...${address.slice(address.length-4,address.length)}`
}

export function User({user}) {

    var iconURL = createIcon({
        seed: user.address,
        size: 15,
        scale: 2
    }).toDataURL()

    return <div className="userItem">
        
        <div className="profileImage">
        {/* https://stackoverflow.com/a/45212793 */}
        <img src={user.profileImage ? user.profileImage : iconURL }></img>
        </div>
        <div className="detailContainer">
            <div className="username">{user.ens}</div>
            <div style={{cursor: "copy"}} className="address"
            onClick={() => window.navigator.clipboard.writeText(user.address)}
            >{truncateAddress(user.address)}</div>
        </div>
    </div>
}

export default User