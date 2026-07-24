const EmptyState = ({ title, subtitle }) => {
  return (
    <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
      <h2>{title}</h2>

      <p
        style={{
          marginTop: "12px",
          color: "var(--text-secondary)"
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default EmptyState;