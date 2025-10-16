
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        setError("");
        setSuccess(true);
        toast.success(`✅ Logged in as ${result.user.username || result.user.email}`);

        setTimeout(() => {
          setSuccess(false);
          if (result.user.role === "admin") {
            navigate("/admino");
          } else {
            navigate("/");
          }
        }, 800);
      } else {
        const msg = result.error || "❌ Login failed. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong while logging in.");
      toast.error("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle back to home manually
  const handleGoHome = () => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    if (parsedUser?.role === "admin") {
            toast.success("Redirected to Admin Dashboard");

      navigate("/admino");
    } else {
            toast.success("Redirected to Home");

      navigate("/");
    }
  };

  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center bg-no-repeat" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop')"
      }}
    >
      {/* ✅ Success Popup */}
      {/* {success && (
        <div  className="fixed top-5 right-5 z-100">
          <div className="bg-white text-green-700 font-semibold px-6 py-4 rounded-xl shadow-lg border border-green-600 animate-bounce">
            ✅ Login Successful! Redirecting...
          </div>
        </div>
      )} */}

      <div className="relative w-full max-w-md rounded-xl bg-white/70 p-8 shadow-xl backdrop-blur-lg">
        {/* Close button */}
        <button
          onClick={handleGoHome}
          className="absolute right-4 top-4 text-white text-2xl hover:text-gray-300"
          disabled={loading}
        >
          &times;
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          WELCOME BACK!
        </h2>
        <p className="mb-6 text-center text-sm text-gray-200">
          Log in to activate special member pricing.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-black focus:outline-none text-white placeholder-gray-500 bg-transparent"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-black focus:outline-none text-white placeholder-gray-500 bg-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                LOGGING IN...
              </div>
            ) : (
              "SUBMIT"
            )}
          </button>
        </form>

        <div className="my-4 flex items-center justify-center text-white">
          <span className="mx-2">Or</span>
        </div>

        <div className="mt-2 text-center text-sm text-white">
          Not a member?{" "}
          <button
            onClick={handleGoToRegister}
            className="font-semibold hover:underline disabled:opacity-50"
            disabled={loading}
          >
            Join today
          </button>
        </div>
      </div>
    </div>
  );
}
