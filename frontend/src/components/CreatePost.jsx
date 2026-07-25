import { useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { createPost } from "../api/posts/postApi";
import "./CreatePost.css";

const CreatePost = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitPost = async (e) => {
    e.preventDefault();

    if (!caption.trim()) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", caption);

      if (image) {
        formData.append("image", image);
      }

      await createPost(formData);

      setCaption("");
      setImage(null);

      // Refresh feed without reloading page
      if (onPostCreated) {
        onPostCreated();
      }

    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card create-post">
      <form onSubmit={submitPost}>
        <textarea
          placeholder="What's happening today?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <input
          type="file"
          id="image"
          hidden
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="create-post-footer">
          <label
            htmlFor="image"
            className="btn btn-secondary"
            style={{ cursor: "pointer" }}
          >
            <ImagePlus size={18} />
            {image ? image.name : "Image"}
          </label>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            <Send size={18} />
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;