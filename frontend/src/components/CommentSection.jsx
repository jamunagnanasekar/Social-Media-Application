import { useEffect, useState } from "react";

import {
  getComments,
  addComment,
} from "../api/comments/commentApi";

const CommentSection = ({ postId, onCommentAdded }) => {
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

      // Update comment count in PostCard
      if (onCommentAdded) {
        onCommentAdded();
      }

    } catch (err) {
      console.log(err);
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
          }}
        >
          <strong>{comment.user?.name}</strong>

          <p>{comment.text}</p>
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