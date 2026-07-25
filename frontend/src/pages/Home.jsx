import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";

import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import { getAllPosts } from "../api/posts/postApi";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const data = await getAllPosts();

      setPosts(data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <CreatePost onPostCreated={fetchPosts} />

     {loading ? (
  <>
    <Loader />
    <Loader />
    <Loader />
  </>
) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Create your first post."
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

export default Home;