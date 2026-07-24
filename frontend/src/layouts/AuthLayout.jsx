const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--bg-primary)",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2rem",
        }}
      >
        <h1 style={{ marginBottom: "10px" }}>{title}</h1>

        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "25px",
          }}
        >
          {subtitle}
        </p>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;