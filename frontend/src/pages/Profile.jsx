import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import ProfileHeader from "../components/ProfileHeader";

import { getUserProfile } from "../api/users/userAPI";

const Profile = () => {
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const data = await getUserProfile(username);

      setProfile(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProfileHeader
        user={profile}
        refreshProfile={fetchProfile}
      />
    </MainLayout>
  );
};

export default Profile;