import './Home.css';
import React, { useContext } from 'react'
import axios from "axios";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import { AuthContext } from '../helpers/AuthContext';

function Home() {

  const [listOfPosts, setListofPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
    else {
      axios.get("http://localhost:3001/posts", { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
        setListofPosts(response.data.listOfPosts);
        setLikedPosts(response.data.likedPosts.map((like) => { return like.PostId }));
      });
    }
  }, []);

  const likePost = (postId) => {
    axios.post("http://localhost:3001/like", { PostId: postId }, { headers: { accessToken: localStorage.getItem("accessToken") } }).then((response) => {
      setListofPosts(listOfPosts.map((post) => {
        if (post.id === postId) {
          if (response.data.liked) {
            return { ...post, Likes: [...post.Likes, 0] }
          }
          else {
            const likesArray = post.Likes;
            likesArray.pop();
            return { ...post, Likes: likesArray };
          }
        }
        else {
          return post;
        }
      }))
      if (likedPosts.includes(postId)) {
        setLikedPosts(likedPosts.filter((id) => {
          return id != postId;
        }))
      }
      else {
        setLikedPosts([...likedPosts, postId]);
      }
    });
  };

  console.log(listOfPosts);
  return (
    <div>
      {listOfPosts.map((value, key) => {
        return (
          <div key={key} className='post'>
            <div className='title'> {value.title} </div>
            <div className='body' onClick={() => { navigate(`/post/${value.id}`) }}> {value.postText} </div>
            <div className='footer'>
              <div className='username' ><Link to ={`profile/${value.UserId}`}>{value.username}</Link></div>
              <div className='buttons'>
                <ThumbUpAltIcon className={likedPosts.includes(value.id) ? "unlikeButton" : "likeButton"} onClick={() => likePost(value.id)}></ThumbUpAltIcon>
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Home
