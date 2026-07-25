import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

import API from "../api/axios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data.data || []);

      await API.put("/notifications/read");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    if (!window.confirm("Clear all notifications?")) return;

    try {
      await API.delete("/notifications");

      setNotifications([]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <MainLayout>
      <div
        className="card"
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Notifications</h2>

        <button
          className="btn btn-danger"
          onClick={clearNotifications}
        >
          Clear All
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You're all caught up."
        />
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className="card"
            style={{ marginBottom: 15 }}
          >
            <strong>{n.sender?.name}</strong>

            <p style={{ marginTop: 8 }}>
              {n.type === "like" && "liked your post ❤️"}

              {n.type === "comment" && "commented on your post 💬"}

              {n.type === "follow" && "started following you 👤"}
            </p>
          </div>
        ))
      )}
    </MainLayout>
  );
};

export default Notifications;