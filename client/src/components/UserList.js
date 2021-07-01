import React from "react"
import {User} from "./User"

function UserList({title, users, onSelectUser, emptyMessage, currentUser, displayedUser}) {
    let isDisplayingCurrentUser = currentUser && displayedUser && (currentUser.address.toLowerCase() === displayedUser.address.toLowerCase())
    
    return <div className="card">
        <h2>{title}</h2>
        <div className="userList">
            {
            users.length === 0 ? emptyMessage :
            users.map(user => {
                let isFriend = currentUser && currentUser.friends.map(u => u.address).includes(user.address)
                let isCurrentUser = currentUser && currentUser.address == user.address
                
                return <div key={user.address} style={{paddingBottom: "11px"}}>
                    <User user={user} onSelectUser={onSelectUser} miscText={ !isDisplayingCurrentUser && isFriend ? "Mutual" : isCurrentUser ? "You" : undefined}></User>
                </div>
            })
            }
        </div>
    </div>
}

export default UserList