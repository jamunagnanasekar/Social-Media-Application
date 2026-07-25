import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(form.emailOrUsername, form.password);

      navigate("/");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back 👋"
      description="Login to ConnectHub"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Email or Username"
          name="emailOrUsername"
          value={form.emailOrUsername}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        Don't have an account?{" "}
        <Link to="/register">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;