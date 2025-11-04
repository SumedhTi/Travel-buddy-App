import Blog from "../Modules/Schema.js";

// 📥 Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Create new blog
export const createBlog = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const blog = new Blog({ content, image });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete a blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Assuming frontend sends userId (author username)

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // ✅ Check if the current user is the author
    if (blog.author !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Simulated user (replace with real auth user later)
    const userId = req.body.userId || "user123";

    // Check if the user has already liked it
    const likedIndex = blog.likedBy.indexOf(userId);

    if (likedIndex === -1) {
      // 👍 Like
      blog.likedBy.push(userId);
      blog.likes += 1;
    } else {
      // 👎 Unlike
      blog.likedBy.splice(likedIndex, 1);
      blog.likes -= 1;
    }

    // Save and return updated info
    await blog.save();
    res.status(200).json({ likes: blog.likes, likedBy: blog.likedBy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
