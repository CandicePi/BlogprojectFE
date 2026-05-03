import { useContext, useEffect, useState } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  const [allBlog, setAllBlog] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    content: "",
  });

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blog/getAllBlogPosts");
      setAllBlog(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (error) {
      if (error.response?.status === 401) logout();
      console.log(error);
    }
  };

  // ✅ Delete
  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await API.delete(`/blog/deletePost/${id}`);
      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ Create / Update
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const data = new FormData();
      data.append("title", formData.title);
      data.append("subtitle", formData.subtitle);
      data.append("imageUrl", formData.imageUrl);
      data.append("content", formData.content);

      console.log("USER:", JSON.parse(localStorage.getItem("user")));
      if (editingBlog) {
        await API.put(`/blog/UpdatePost/${editingBlog._id}`, {
          title: formData.title,
          subtitle: formData.subtitle,
          imageUrl: formData.imageUrl,
          content: formData.content,
        });
      } else {
        await API.post("/blog/upload-blog", {
  title: formData.title,
  subtitle: formData.subtitle,
  imageUrl: formData.imageUrl,
  content: formData.content,
});
      }

      // reset
      setFormData({ title: "", subtitle: "", imageUrl: "", content: "" });
      setEditingBlog(null);

      fetchBlogs();
      setActiveTab("home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit
  const editBlog = (blog) => {
    setEditingBlog(blog);

    setFormData({
      title: blog.title,
      subtitle: blog.subtitle,
      imageUrl: blog.imageUrl,
      content: blog.content,
    });

    setActiveTab("create");
  };

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      window.location.href = "/login";
    }

    fetchBlogs();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <h1>Welcome Back, {user?.name}</h1>
          <p className="user-email">{user?.email}</p>
        </div>

        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>

        <button
          className={`tab ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          {editingBlog ? "Edit Blog" : "Create Blog"}
        </button>

        <button
          className={`tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View Blog
        </button>
      </div>
      {/* HOME */}
      {activeTab === "home" && (
        <div className="blog-section">
          <h2>All Blogs</h2>

          {allBlog.length === 0 ? (
            <p>No blogs available</p>
          ) : (
            <div className="blog-list">
              {allBlog.map((b) => (
                <div key={b._id} className="blog-card">
                  <h3>{b.title}</h3>
                  <p className="blog-subtitle">{b.subtitle}</p>
                  <p className="blog-subtitle">{b.imageUrl}</p>
                  <p className="blog-content">{b.content}</p>

                  <div className="blog-date">
                    {new Date(b.createdAt).toLocaleString()}
                  </div>

                  {/* ✅ ACTIONS */}
                  <div className="blog-actions">
                    <button
                      onClick={() => editBlog(b)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteBlog(b._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE / EDIT */}
      {activeTab === "create" && (
        <div className="action-card">
          <h2>{editingBlog ? "Edit Blog" : "Create Blog"}</h2>

          <div className="form-group">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="ImageUrl"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Write your blog..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : editingBlog
                ? "Update Blog"
                : "Publish Blog"}
          </button>
        </div>
      )}

      {/* VIEW */}
      {activeTab === "view" && (
        <div className="blog-section">
          <h2>View Blogs</h2>

          {allBlog.map((b) => (
            <div key={b._id} className="blog-item">
              <h3>{b.title}</h3>
              <p>{b.subtitle}</p>
              <p>{b.content}</p>
              <span>{new Date(b.createdAt).toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;