import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    const newUser = { 
      username, 
      email, 
      password,
      cart: [],
      wishlist: [],
      isLoggedIn: true,
      role: "user",
      isBlock: false
    };

    try {
      // Check if user already exists
      const checkRes = await fetch(`http://localhost:5001/users?email=${email}`);
      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        setError("Email already registered!");
        setLoading(false);
        return;
      }

      // ✅ Send POST request to JSON server
      const res = await fetch("http://localhost:5001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Failed to register user");

      const createdUser = await res.json();

      if (!createdUser.id) {
        throw new Error("User creation failed: no ID returned");
      }

      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(createdUser));

      setError("");
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        navigate("/"); // redirect to home page
      }, 2000);

    } catch (err) {
      console.error("❌ Error:", err);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* ✅ Success Popup (Top-Right Corner) */}
      {success && (
        <div className="fixed top-5 right-5 z-50">
          <div className="bg-white text-green-700 font-semibold px-6 py-4 rounded-xl shadow-lg border border-green-600 animate-bounce">
            ✅ Registration Successful! Redirecting...
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md rounded-xl bg-white/70 p-8 shadow-xl backdrop-blur-lg">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://i.pinimg.com/1200x/33/f5/64/33f5644c7aa323e29761d4a4cf9ab8cc.jpg"
            alt="Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Close button */}
        <button
          onClick={handleBackToLogin}
          className="absolute right-4 top-4 text-white text-2xl hover:text-gray-300"
          disabled={loading}
        >
          &times;
        </button>

        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          CREATE ACCOUNT
        </h2>
        <p className="mb-6 text-center text-sm text-gray-200">
          Join us today and unlock special member pricing.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-black text-white focus:outline-none placeholder-gray-500 bg-transparent"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-black text-white focus:outline-none placeholder-gray-500 bg-transparent"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-black text-white focus:outline-none placeholder-gray-500 bg-transparent"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 p-3 focus:border-black text-white focus:outline-none placeholder-gray-500 bg-transparent"
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
                CREATING ACCOUNT...
              </div>
            ) : (
              "REGISTER"
            )}
          </button>
        </form>

        <div className="my-4 flex items-center justify-center text-white">
          <span className="mx-2">Or</span>
        </div>

        {/* Social signup */}

        <div className="mt-4 text-center text-sm text-white">
          Already have an account?{" "}
          <button
            onClick={handleBackToLogin}
            className="font-semibold hover:underline disabled:opacity-50"
            disabled={loading}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}