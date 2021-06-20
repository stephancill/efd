import React from "react"
import "./User.css"
import { createIcon } from '@download/blockies';

function truncateAddress(address) {
    return `${address.slice(0,6)}...${address.slice(address.length-4,address.length)}`
}

function User(props) {
    const user = props.user

    var iconURL = createIcon({ // All options are optional
        seed: user.address, // seed used to generate icon data, default: random
        size: 15, // width/height of the icon in blocks, default: 10
        scale: 2 // width/height of each block in pixels, default: 5
    }).toDataURL()

    return <div className="userItem">
        
        <div className="profileImage">
        {/* https://stackoverflow.com/a/45212793 */}
        <img src={user.profileImage ? user.profileImage : iconURL }></img>
        </div>
        <div className="detailContainer">
            <div className="username">{user.ens}</div>
            <div className="address">{truncateAddress(user.address)}</div>
        </div>
    </div>
}

export default User