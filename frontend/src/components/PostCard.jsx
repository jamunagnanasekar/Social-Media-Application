import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  likePost,
  deletePost,
} from "../api/posts/postApi";
import { toggleBookmark } from "../api/bookmarks/bookmarkApi";
import CommentSection from "./CommentSection";

import "./PostCard.css";

const PostCard = ({ post }) => {
  const { user } = useAuth();

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(
    post.commentsCount || 0
  );
  const [showComments, setShowComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const imageUrl = post.image
    ? `http://localhost:5000${post.image}`
    : null;

  const handleLike = async () => {
    try {
      const data = await likePost(post._id);
      setLikes(data.likesCount);
    } catch (err) {
      console.error(err);
      alert("Failed to like post");
    }
  };

  const handleBookmark = async () => {
    try {
      const data = await toggleBookmark(post._id);
      setBookmarked(data.isBookmarked);
    } catch (err) {
      console.error(err);
      alert("Failed to bookmark post");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    try {
      await deletePost(post._id);

      alert("Post deleted successfully");

      // We'll improve this in the next step
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <img
          src={
            post.user?.profilePic ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              post.user?.name || "User"
            )}&background=4F46E5&color=fff`
          }
          alt={post.user?.name}
          className="post-avatar"
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div>
            <h4>{post.user?.name}</h4>
            <small>@{post.user?.username}</small>
          </div>

          {user?._id === post.user?._id && (
            <button
              onClick={handleDelete}
              title="Delete Post"
              style={{
                color: "red",
              }}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <p className="post-content">{post.content}</p>

      {imageUrl && (
        <img
          src={imageUrl}
          className="post-image"
          alt="Post"
        />
      )}

      <div className="post-actions">
        <button onClick={handleLike}>
          ❤️ {likes}
        </button>

        <button onClick={() => setShowComments(!showComments)}>
          💬 {commentsCount}
        </button>

        <button onClick={handleBookmark}>
          {bookmarked ? "📌" : "🔖"}
        </button>

        <button>
          <Share2 size={18} />
        </button>
      </div>

      {showComments && (
        <CommentSection
  postId={post._id}
  onCommentAdded={() =>
    setCommentsCount((prev) => prev + 1)
  }
  onCommentDeleted={() =>
    setCommentsCount((prev) => Math.max(prev - 1, 0))
  }
/>
      )}
    </div>
  );
};

export default PostCard;