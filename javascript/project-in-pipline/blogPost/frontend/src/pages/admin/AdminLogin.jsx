import { useState } from "react";
import axios from'axios';

import {useNavigate} from 'react-router-dom';


function AdminLogin()
{
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const API_URL = 'http://localhost:3000/api'; // Update with your backend URL
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const {data} = await axios.post(`${API_URL}/admin/login`, {username, password});
            localStorage.setItem('adminToken', data.token);
            navigate('/admin/dashboard');
        }
        catch(error)
        {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return(<div>
            <h1>Admin Login Page</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type = "text"
                    placeholder="Admin Username"
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                />

                <input
                     type = "password"
                     placeholder="password"
                     value={password}
                     onChange={(e)=>{setPassword(e.target.value)}}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );

}

export default AdminLogin;