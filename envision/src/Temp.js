import { useEffect, useState } from "react";
import axios from "axios";

const Temp = () => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        async function getAllUsers() {
            try {
                const users = await axios.get("http://127.0.0.1:8000/api/users/")
                setUsers(users.data)
            } catch (error) {
                console.log(error)
            }
        }
        getAllUsers()
    }, [])
    return (
        <div>
            <h1>
                Temp
            </h1>
            {
                users.map((user, i) => {
                    return (
                        <div key={i}>
                            <h3>{user.username}</h3>
                            <h5>{user.email}</h5>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Temp;