import { useState, useEffect } from "react";
import styles from "./BlogFeed.module.css";
import { BASE } from "../../../api.js";
import { Heart, Plus, Trash2Icon } from "lucide-react";
import { useUser } from "../../GlobalUserContext.jsx";
import { useNavigate } from "react-router-dom";
import fetchData from "../../request.js";


const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const { state, dispatch } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetchData("/blogs", "GET", navigate, dispatch);
      if (res) {
        setBlogs(res);
      } 
    };
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Please write something!");
    const res = await fetchData("/blogs", "POST", navigate, dispatch, { content, image });
    if (res) {
      setBlogs((prev) => [res, ...prev]);
    }
    setContent("");
    setImage("");
    setShowModal(false);
  };

  const handleLike = async (id) => {
    const data = await fetchData(`/blogs/${id}/like`, "POST", navigate, dispatch);
    if (data) {
      const data = await res.json();
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id
            ? { ...b, likedBy: data.likedBy }
            : b
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    await fetchData(`/blogs/${id}`, "DELETE", navigate, dispatch); 
    setBlogs((prev) => prev.filter((b) => b._id !== id));
  };

  return (
    <div className={styles.blogcontainer}>
      <h1 className={styles.blogtitle}>Travel Blog</h1>
      <p className={styles.blogsubtitle}>
        Share your adventures and explore journeys from around the world!
      </p>

      <div className={styles.blogfeed}>
        {blogs.length === 0 ? (
          <div className={styles.noblogs}>
            No blogs yet — start your first travel story!
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className={styles.blogcard}>
              {blog.authorId === state.user.id && (
                <button
                  className={styles.deletebtntop}
                  onClick={() => handleDelete(blog._id)}
                  title="Delete Blog"
                >
                  <Trash2Icon />
                </button>
              )}

              {blog.image && (
                <img src={blog.image} alt="Blog" className={styles.blogimage} />
              )}
              <p className={styles.blogcontent}>{blog.content}</p>

              <div className={styles.blogfooter}>
                <div className={styles.bloginfo}>
                  <span className={styles.blogauthor}>@{blog.authorName?.split(" ")[0] || "Unknown"} </span>
                  <span className={styles.blogdate}>
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  className={`${styles.likebtn} ${
                    blog.likedBy?.includes(state.user.id) ? styles.liked : ""
                  }`}
                  onClick={() => handleLike(blog._id)}
                >
                  <Heart size={14} /> {blog.likedBy.length || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className={styles.addbtn} onClick={() => setShowModal(true)}>
        <Plus size={20} />
      </button>

      {/* ✏️ New Blog Modal */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalcontent}>
            <h3>Write a new travel story ✈️</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your travel experience..."
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Optional: Image URL"
            />
            <div className={styles.modalbuttons}>
              <button onClick={handleSubmit}>Post</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogFeed;
