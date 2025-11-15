import { Blog } from "../Modules/Schema.js";

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { content, image } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const blog = new Blog({ authorId: req.user.id, authorName: req.user.username, content, image });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; 

    const blog = await Blog.findById(id);

    if (blog.authorId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const userId = req.user.id;
    const likedIndex = blog.likedBy.indexOf(userId);

    if (likedIndex === -1) {
      blog.likedBy.push(userId);
    } else {
      blog.likedBy.splice(likedIndex, 1);
    }

    await blog.save();
    res.status(200).json({ likedBy: blog.likedBy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
