import { useLocation } from "react-router-dom";
import "./singlePost.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../../context/Context";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/favcontext";

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const PF = "http://localhost:5000/images/";
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const { addToFavorites } = useFavorites();

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get("/posts/" + path);
        setPost(res.data);
        setTitle(res.data.title);
        setDesc(res.data.desc);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    getPost();
  }, [path]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/posts/${post._id}`, {
        username: user.username,
        title,
        desc,
      });
      setUpdateMode(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleAddToFavorites = () => {
    console.log("Adding to favorites:", post);
    addToFavorites(post);
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {user.username === null ? (
          <>
            {post.photo && (
              <img src={PF + post.photo} alt="" className="singlePostImg" />
            )}
            {updateMode ? (
              <>
                <input
                  type="text"
                  value={title}
                  className="singlePostTitleInput"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
              </>
            ) : (
              <h1 className="singlePostTitle">
                {title}
              </h1>
            )}
            <div className="singlePostInfo">
              <span className="singlePostAuthor">
                Author:
                <Link to={`/?user=${post.username}`} className="link">
                  <b> {post.username}</b>
                </Link>
              </span>
              <span className="singlePostDate">
                {new Date(post.createdAt).toDateString()}
              </span>
            </div>
            <p className="singlePostDesc">{desc}</p>
          </>
        ) : (
          // Render this block if the user is authenticated
          <>
            {post.photo && (
              <img src={PF + post.photo} alt="" className="singlePostImg" />
            )}
            {updateMode ? (
              <>
                <input
                  type="text"
                  value={title}
                  className="singlePostTitleInput"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
              </>
            ) : (
              <h1 className="singlePostTitle">
                {title}
                {(post.username === user?.username ||
                  user.username === "admin") && (
                  <div className="singlePostEdit">
                    <i
                      className="singlePostIcon far fa-edit"
                      onClick={() => setUpdateMode(true)}
                    ></i>
                    <i
                      className="singlePostIcon far fa-trash-alt"
                      onClick={handleDelete}
                    ></i>
                  </div>
                )} {user.username && (
                  <button className="Favbutton" onClick={handleAddToFavorites}>Add to Fav</button>
                )}
              </h1>
            )}
           
            <div className="singlePostInfo">
              <span className="singlePostAuthor">
                Author:
                <Link to={`/?user=${post.username}`} className="link">
                  <b> {post.username}</b>
                </Link>
              </span>
              <span className="singlePostDate">
                {new Date(post.createdAt).toDateString()}
              </span>
            </div>
            {updateMode ? (
              <textarea
                className="singlePostDescInput"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            ) : (
              <p className="singlePostDesc">{desc}</p>
            )}
            {updateMode && (
              <button className="singlePostButton" onClick={handleUpdate}>
                Update
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
  
}
