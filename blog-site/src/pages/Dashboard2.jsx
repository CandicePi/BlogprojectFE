import { useContext, useEffect, useState } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const { user, logout } = useContext(AuthContext);

  const [allBlog, setAllBlog] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    content: ""
  });

  const [imageFile, setImageFile] = useState(null);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blog/getAllBlogPosts");
      setAllBlog(res.data);
    } catch (error) {
      logout();
    }
  };

  const createBlog = async () => {
    try {

      setLoading(true);

      await API.post("/posts/createBlog", formData);

      setFormData({
        title: "",
        subtitle: "",
        imageUrl: "",
        content: ""
      });

      fetchBlogs();

      setActiveTab("home");

    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

//  useEffect(() => {
//   const storedUser = localStorage.getItem("user");

//   if (!storedUser) {
//     window.location.href = "/login";
//     return;
//   }

//   // Parse the stored user
//   const parsedUser = JSON.parse(storedUser);
//   if (!parsedUser?.token) {  // or whatever your login token key is
//     window.location.href = "/login";
//     return;
//   }

//   fetchBlogs();

// }, []);

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <div>
          <h1>Welcome Back, {user?.name}</h1>
          <p className="user-email">{user?.email}</p>
        </div>

        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </header>


      {/* Navigation Tabs */}

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
          Create Blog
        </button>

        <button
          className={`tab ${activeTab === "view" ? "active" : ""}`}
          onClick={() => setActiveTab("view")}
        >
          View Blog
        </button>

      </div>


      {/* HOME (ALL BLOGS) */}

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

                  <img src={b.imageUrl} alt="blog" className="blog-image" />

                  <p className="blog-content">{b.content}</p>

                  <div className="blog-date">{b.createdAt}</div>

                </div>

              ))}

            </div>
          )}

        </div>

      )}


      {/* CREATE BLOG */}



      {activeTab === "create" && (

        <div className="action-card">

          <h2>Create Blog</h2>

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
              placeholder="Image URL"
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

          <button className="btn btn-primary" onClick={createBlog} disabled={loading}>
            {loading ? "Publishing..." : "Publish Blog"}
          </button>

        </div>

      )}


      {/* VIEW BLOG */}

      {activeTab === "view" && (

        <div className="blog-section">

          <h2>View Blogs</h2>

          {allBlog.map((b) => (

            <div key={b._id} className="blog-item">

              <h3>{b.title}</h3>

              <p>{b.subtitle}</p>

              <p>{b.content}</p>

              <span>{b.createdAt}</span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}


const createBlog = async () => {

  const data = new FormData();

  data.append("title", formData.title);
  data.append("subtitle", formData.subtitle);
  data.append("content", formData.content);
  data.append("image", imageFile);

  await API.post("/posts/createBlog", data);

};


export default Dashboard;