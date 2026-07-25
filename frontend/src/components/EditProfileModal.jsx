import { useState } from "react";
import { updateProfile } from "../api/users/userAPI";
import { useAuth } from "../context/AuthContext";

const EditProfileModal = ({
  user,
  refreshProfile,
  onClose,
}) => {
  const { updateUserState } = useAuth();

  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");

  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  const [loading, setLoading] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("bio", bio);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      if (coverPic) {
        formData.append("coverPic", coverPic);
      }

      const res = await updateProfile(formData);

      updateUserState(res.data);

      refreshProfile();

      onClose();

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "grid",
        placeItems: "center",
        zIndex: 999,
      }}
    >
      <div
        className="card"
        style={{
          width: "520px",
          maxWidth: "95%",
        }}
      >
        <h2>Edit Profile</h2>

        <form onSubmit={saveProfile}>

          <input
            className="input-field"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="input-field"
            rows="4"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            style={{
              marginTop: 15,
            }}
          />

          <div style={{ marginTop: 20 }}>
            <label>Profile Picture</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePic(e.target.files[0])
              }
            />
          </div>

          <div style={{ marginTop: 15 }}>
            <label>Cover Picture</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverPic(e.target.files[0])
              }
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 25,
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfileModal;