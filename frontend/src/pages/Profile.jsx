import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";

const Profile = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <ProfileHeader user={user} />
    </MainLayout>
  );
};

export default Profile;