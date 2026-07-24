const Button = ({ children, ...props }) => {
  return (
    <button
      className="btn btn-primary"
      style={{
        width: "100%",
        marginTop: "10px",
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;