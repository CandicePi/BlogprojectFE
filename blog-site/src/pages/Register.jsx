import {useState, useContext, useEffect} from 'react'
import API from '../api/api';
import { AuthContext } from "../context/AuthContext";




function Register() {
    useEffect(() => {
        if (localStorage.getItem('user')){
            window.location.href = "/dashboard"
        }
    }, [])

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })

    const { login } = useContext(AuthContext)

    const submitHandler = async (e) => {
        e.preventDefault()
        const res = await API.post("/users/signup", form)
        login(res.data)
        window.location.href = "/dashboard"
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
                <h2>Register</h2>
                <input type="text" placeholder='username' onChange={(e) => setForm({...form, username: e.target.value})}/>
                <input type="text" placeholder='Email' onChange={(e) => setForm({...form, email: e.target.value})}/>
                <input type="password" placeholder= 'Password' onChange={(e) => setForm({...form, password: e.target.value})}/>
                \
                <button>Register</button>
            </form>
        </div>
    )
}

export default Register