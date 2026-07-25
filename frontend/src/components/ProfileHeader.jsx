import { useState } from "react";
import { Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { followUser } from "../api/users/userAPI";
import EditProfileModal from "./EditProfileModal";
import toast from "react-hot-toast";

const ProfileHeader = ({ user, refreshProfile }) => {
  const { user: currentUser } = useAuth();

  const [open, setOpen] = useState(false);

  const [followers, setFollowers] = useState(
    user?.followers?.length || 0
  );

  const [isFollowing, setIsFollowing] = useState(
    user?.followers?.includes(currentUser?._id)
  );

  const isOwnProfile = currentUser?._id === user?._id;

  // Cloudinary returns complete HTTPS URLs
  const profilePic = user?.profilePic
    ? user.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}&background=4F46E5&color=fff`;

  const coverPic = user?.coverPic || null;

  const handleFollow = async () => {
    try {
      const res = await followUser(user._id);

      if (res.isFollowing) {
        setFollowers((prev) => prev + 1);
      } else {
        setFollowers((prev) => prev - 1);
      }

      setIsFollowing(res.isFollowing);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div
        className="card"
        style={{
          overflow: "hidden",
          padding: 0,
        }}
      >
        <div
          style={{
            height: 180,
            background: coverPic
              ? `url(${coverPic}) center/cover`
              : "#dbe4ff",
          }}
        />

        <div style={{ padding: 30 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 20,
              }}
            >
              <img
                src={profilePic}
                alt={user?.name}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginTop: -80,
                  border: "5px solid white",
                }}
              />

              <div>
                <h2>{user?.name}</h2>

                <p
                  style={{
                    color: "var(--text-secondary)",
                  }}
                >
                  @{user?.username}
                </p>

                <p
                  style={{
                    marginTop: 15,
                  }}
                >
                  {user?.bio || "No bio added yet."}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 30,
                    marginTop: 20,
                  }}
                >
                  <strong>{user?.postsCount || 0} Posts</strong>

                  <strong>{followers} Followers</strong>

                  <strong>{user?.following?.length || 0} Following</strong>
                </div>
              </div>
            </div>

            {isOwnProfile ? (
              <button
                className="btn btn-secondary"
                onClick={() => setOpen(true)}
              >
                <Edit size={18} />
                Edit Profile
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <EditProfileModal
          user={user}
          refreshProfile={refreshProfile}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileHeader;