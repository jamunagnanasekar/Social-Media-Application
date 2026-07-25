import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import { getBookmarks } from "../api/bookmarks/bookmarkAPI";

const Bookmarks = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const data = await getBookmarks();
      setPosts(data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="card" style={{ marginBottom: "20px" }}>
        <h2>🔖 Saved Posts</h2>
        <p style={{ color: "var(--text-secondary)" }}>
          All your bookmarked posts appear here.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Bookmark your favourite posts."
        />
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
          />
        ))
      )}
    </MainLayout>
  );
};

export default Bookmarks;