import React from "react"
import User from "./User"
import "./HeaderUser.css"

function HeaderUser({user, currentUser}) {

    const mutuals = currentUser ? user.friends.filter(u => currentUser.friends.map(f=>f.address).includes(u.address)) : []
    return <div>
        <User user={user}></User>
        <div className="headerDetailContainer">
            <span>{`${user.friends.length} friends`}</span>
            {
                currentUser ? <span style={{marginLeft: "10px"}}>{currentUser ? `${mutuals.length} mutual` : ""}</span> : <></>
            }
        </div>
        
    </div>
}

export default HeaderUser