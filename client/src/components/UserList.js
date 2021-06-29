import React from "react"
import {User} from "./User"

function UserList({title, users, onSelectUser, emptyMessage, currentUser}) {
    return <div className="card">
        <h2>{title}</h2>
        <div className="userList">
            {
            users.length === 0 ? emptyMessage :
            users.map(user => {
                let isFriend = currentUser && currentUser.friends.map(u => u.address.toLowerCase()).includes(user.address.toLowerCase())
                return <div key={user.address} style={{paddingBottom: "11px"}}>
                    <User user={user} onSelectUser={onSelectUser} miscText={isFriend ? "Mutual" : undefined}></User>
                </div>
            })
            }
        </div>
    </div>
}

export default UserList