import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
} from "lucide-react";

import { likePost } from "../api/posts/postApi";
import { toggleBookmark } from "../api/bookmarks/bookmarkApi";
import CommentSection from "./CommentSection";

import "./PostCard.css";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
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

        <div>
          <h4>{post.user?.name}</h4>
          <small>@{post.user?.username}</small>
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
        />
      )}
    </div>
  );
};

export default PostCard;