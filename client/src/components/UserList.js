import React from "react"
import {User} from "./User"

function UserList({title, users, onSelectUser}) {
    return <div className="card">
        <h2>{title}</h2>
        <div className="userList">
            {users.map(user => <div key={user.address} style={{paddingBottom: "11px"}}>
                <User user={user} onSelectUser={onSelectUser}></User>
            </div> )}
        </div>
    </div>
}

export default UserList