import React from "react"
import User from "./User"
import "./HeaderUser.css"

function HeaderUser({user, currentUser}) {
    const mutuals = []
    return <div>
        <User user={user}></User>
        <div className="headerDetailContainer">
            <span>{`${user.friends.length} friends`}</span>
            {
                currentUser ? <span style={{marginLeft: "10px"}}>{`${mutuals.length} mutual`}</span> : <></>
            }
        </div>
        
    </div>
}

export default HeaderUser