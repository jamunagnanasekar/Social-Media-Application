import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "Nothing here",
  description = "No data available.",
}) => {
  return (
    <div
      className="card"
      style={{
        padding: "60px 30px",
        textAlign: "center",
      }}
    >
      <Inbox
        size={60}
        color="var(--primary-color)"
        style={{ marginBottom: "16px" }}
      />

      <h2>{title}</h2>

      <p
        style={{
          marginTop: "12px",
          color: "var(--text-secondary)",
          maxWidth: "420px",
          marginInline: "auto",
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default EmptyState;