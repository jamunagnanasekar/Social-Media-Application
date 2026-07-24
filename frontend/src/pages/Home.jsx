import MainLayout from "../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      <div className="card">
        <h2 style={{ marginBottom: "0.75rem" }}>
          🏠 Home Feed
        </h2>

        <p style={{ color: "var(--text-secondary)" }}>
          Welcome to ConnectHub.
        </p>

        <p
          style={{
            marginTop: "1rem",
            color: "var(--text-muted)",
          }}
        >
          Sprint 1 Completed Successfully.
        </p>
      </div>
    </MainLayout>
  );
};

export default Home;