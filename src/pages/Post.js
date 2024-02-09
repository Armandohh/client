import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Post.css';
import { AuthContext } from '../helpers/AuthContext';

function Post() {
    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byID/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios.post('http://localhost:3001/comments',
            {
                commentBody: newComment,
                PostId: id
            },
            {
                headers: { accessToken: localStorage.getItem("accessToken") }
            }).then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                }
                else {
                    setComments([...comments, response.data]);
                    setNewComment("")
                }
            });
    };

    const deleteComment = (commentID) => {
        axios.delete(`http://localhost:3001/comments/${commentID}`,
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then(() => {
                setComments(comments.filter((val) => {
                    return val.id != commentID;
                }))
            });
    }

    const deletePost = (postID) => {
        axios.delete(`http://localhost:3001/posts/${postID}`,
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken")
                }
            }).then(() => {
                navigate("/");
            });
    }

    const editPost = (option) => {
        if (option === "title") {
            let newTitle = prompt("Enter new title: ");
            axios.put("http://localhost:3001/posts/title",
                {
                    newTitle: newTitle,
                    id: id,
                },
                {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                });

            setPostObject({ ...postObject, title: newTitle });
        }
        else {
            let newPostText = prompt("Enter new post text: ");
            axios.put("http://localhost:3001/posts/postText",
                {
                    newPostText: newPostText,
                    id: id,
                },
                {
                    headers: { accessToken: localStorage.getItem("accessToken") }
                });

            setPostObject({ ...postObject, postText: newPostText });
        }
    }

    return (
        <div className='postPage'>
            <div className='leftSide'>
                <div className='post' id='individual'>
                    <div className='title' onClick={() => { if (authState.username === postObject.username) { editPost("title") }; }}> {postObject.title} </div>
                    <div className='body' onClick={() => { if (authState.username === postObject.username) { editPost("body") }; }}> {postObject.postText} </div>
                    <div className='footer'> {postObject.username}
                        {authState.username === postObject.username && <button onClick={() => deletePost(postObject.id)}>Delete Post</button>}
                    </div>
                </div>
            </div>
            <div className='rightSide'>
                <div className='addCommentContainer'>
                    <input type='text' placeholder='Comment...' value={newComment} autoComplete='off' onChange={(event) => { setNewComment(event.target.value) }} />
                    <button onClick={addComment}> Add Comment </button>
                </div>
                <div className='listOfComments'>
                    {comments.map((comment, key) => {
                        return (<div key={key} className='comment'> {comment.commentBody}
                            <label>Username: {comment.username}</label>
                            {authState.username === comment.username && <button onClick={() => deleteComment(comment.id)}> X</button>}
                        </div>)
                    })}
                </div>
            </div>
        </div >
    )
}

export default Post
