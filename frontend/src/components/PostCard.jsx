import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Share2, Trash2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { likePost, deletePost } from "../api/posts/postApi";
import { toggleBookmark } from "../api/bookmarks/bookmarkApi";
import CommentSection from "./CommentSection";

import "./PostCard.css";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(
    post.commentsCount || 0
  );
  const [showComments, setShowComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Cloudinary returns full HTTPS URLs
  const imageUrl = post.image || null;

  const profilePic = post.user?.profilePic
    ? post.user.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        post.user?.name || "User"
      )}&background=4F46E5&color=fff`;

  const handleLike = async () => {
    try {
      const data = await likePost(post._id);
      setLikes(data.likesCount);
    } catch (err) {
      console.error(err);
      toast.error("Failed to like post");
    }
  };

  const handleBookmark = async () => {
    try {
      const data = await toggleBookmark(post._id);
      setBookmarked(data.isBookmarked);
    } catch (err) {
      console.error(err);
      toast.error("Failed to bookmark post");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deletePost(post._id);

      toast.success("Post deleted successfully");

      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/profile/${post.user?.username}`
      );

      toast.success("Profile link copied");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="card post-card">
      <div
        className="post-header"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/profile/${post.user?.username}`)}
      >
        <img
          src={profilePic}
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
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              title="Delete Post"
              style={{ color: "red" }}
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
          alt="Post"
          className="post-image"
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

        <button onClick={handleShare}>
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