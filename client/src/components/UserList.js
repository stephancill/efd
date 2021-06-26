import React from "react"
import {User} from "./User"

function UserList(props) {
    const users = props.users
    return <div className="userListContainer">
        <h2>{props.title}</h2>
        <div className="userList">
            {users.map(user => <div key={user.address} style={{paddingBottom: "11px"}}>
                <User user={user}></User>
            </div> )}
        </div>
    </div>
}

export default UserList