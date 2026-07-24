import { Edit } from "lucide-react";

const ProfileHeader = ({ user }) => {
  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <img
          src={
            user?.profilePic ||
            `https://ui-avatars.com/api/?name=${user?.name}&background=4F46E5&color=fff`
          }
          alt={user?.name}
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div style={{ flex: 1 }}>
          <h2>{user?.name}</h2>

          <p
            style={{
              color: "var(--text-secondary)",
              marginTop: "4px",
            }}
          >
            @{user?.username}
          </p>

          <p
            style={{
              marginTop: "16px",
              color: "var(--text-secondary)",
            }}
          >
            {user?.bio || "No bio added yet."}
          </p>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "18px",
            }}
          >
            <strong>{user?.postsCount || 0} Posts</strong>
            <strong>{user?.followersCount || 0} Followers</strong>
            <strong>{user?.followingCount || 0} Following</strong>
          </div>
        </div>

        <button className="btn btn-secondary">
          <Edit size={18} />
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;