import React, { useState, useEffect } from "react";
import "./BlogFeed.css";
import { Heart, Plus, Trash2Icon } from "lucide-react";

const BlogFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  const currentUser = "john_doe";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
      }
    };
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) return alert("Please write something!");
    try {
      const res = await fetch("http://localhost:3000/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image, author: currentUser }),
      });
      const newBlog = await res.json();
      setBlogs((prev) => [newBlog, ...prev]);
      setContent("");
      setImage("");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to post blog:", err);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/blogs/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser }),
      });
      const data = await res.json();

      setBlogs((prev) =>
        prev.map((b) =>
          b._id === id
            ? { ...b, likes: data.likes, likedBy: data.likedBy }
            : b
        )
      );
    } catch (err) {
      console.error("Failed to like blog:", err);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this blog?")) return;

  try {
    await fetch(`http://localhost:3000/blogs/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser }), 
    });

    setBlogs((prev) => prev.filter((b) => b._id !== id));
  } catch (err) {
    console.error("Failed to delete blog:", err);
  }
};


  return (
    <div className="blog-container">
      <h1 className="blog-title">Travel Blog</h1>
      <p className="blog-subtitle">
        Share your adventures and explore journeys from around the world!
      </p>

      <div className="blog-feed">
        {blogs.length === 0 ? (
          <div className="no-blogs">
            No blogs yet — start your first travel story!
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              {/* ❌ Delete Button (top-right corner) */}
              {blog.author === currentUser && (
               <button
                    className="delete-btn-top"
                       onClick={() => handleDelete(blog._id)}
                           title="Delete Blog"
                             >
                          <Trash2Icon />
                </button>
              )}

              {blog.image && (
                <img src={blog.image} alt="Blog" className="blog-image" />
              )}
              <p className="blog-content">{blog.content}</p>

              <div className="blog-footer">
                <div className="blog-info">
                  <span className="blog-author">@{blog.author}</span>
                  <span className="blog-date">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  className={`like-btn ${
                    blog.likedBy?.includes(currentUser) ? "liked" : ""
                  }`}
                  onClick={() => handleLike(blog._id)}
                >
                  <Heart size={14} /> {blog.likes || 0}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="add-btn" onClick={() => setShowModal(true)}>
        <Plus size={20} />
      </button>

      {/* ✏️ New Blog Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
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
            <div className="modal-buttons">
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
