import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import {
  getComments,
  addComment,
  deleteComment,
} from "../api/comments/commentApi";

const CommentSection = ({
  postId,
  onCommentAdded,
  onCommentDeleted,
}) => {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      setComments(data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await addComment(postId, text);

      setText("");

      fetchComments();

      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm(
      "Delete this comment?"
    );

    if (!confirmDelete) return;

    try {
      await deleteComment(commentId);

      fetchComments();

      if (onCommentDeleted) {
        onCommentDeleted();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete comment");
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      {comments.map((comment) => (
        <div
          key={comment._id}
          style={{
            marginBottom: "10px",
            padding: "8px 0",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <strong>{comment.user?.name}</strong>
            <p>{comment.text}</p>
          </div>

          {user?._id === comment.user?._id && (
            <button
              onClick={() => handleDelete(comment._id)}
              title="Delete Comment"
              style={{ color: "red" }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}

      <form onSubmit={handleComment}>
        <input
          className="input-field"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="btn btn-primary"
          style={{
            marginTop: "10px",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentSection;