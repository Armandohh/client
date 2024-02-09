import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../helpers/AuthContext';

function Profile() {
    let { id } = useParams();
    let navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [usersPosts, setUsersPosts] = useState([]);
    const { authState } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`http://localhost:3001/auth/basicinfo/${id}`).then((response) => {
            setUsername(response.data.basicInfo.username);
            setUsersPosts(response.data.usersPosts);
        })
    }, []);

    return (
        <div className='profilePageContainer'>
            <div className='basicInfo'>
                <h1>Username: {username} </h1>
                {authState.username === username
                    && (
                        <button onClick={() => navigate("/changepassword")}>Change My Password</button>
                    )}
            </div>
            <div className='usersPosts'>
                {usersPosts.map((value, key) => {
                    return (
                        <div key={key} className='post'>
                            <div className='title'> {value.title} </div>
                            <div className='body'> {value.postText} </div>
                            <div className='footer'>
                                <div className='username'> {value.username} </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile
