import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import PostCard from "../components/PostCard";

import { getAllPosts } from "../api/posts/postApi";

const Explore = () => {
  const [searchParams] = useSearchParams();

  const tag = searchParams.get("tag");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [tag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const data = await getAllPosts(tag);

      setPosts(data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="card" style={{ marginBottom: 20 }}>
        <h2>Explore</h2>

        <p style={{ color: "var(--text-secondary)" }}>
          {tag ? `Showing #${tag}` : "Latest posts"}
        </p>
      </div>

      {loading ? (
       <>
  <Loader />
  <Loader />
  <Loader />
</>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts found"
          description="Try another hashtag."
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

export default Explore;