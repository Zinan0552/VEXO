// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   // 🧠 Login function: check if user exists in db.json
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`http://localhost:5001/users?email=${email}`);
//       const users = await res.json();

//       if (users.length === 0) {
//         alert("⚠️ User not found. Please register first.");
//         return;
//       }

//       const user = users[0];

//       if (user.password === password) {
//         alert(`✅ Welcome back, ${user.username}!`);
//         navigate("/"); // Redirect to Home Page after login
//       } else {
//         alert("❌ Incorrect password. Try again.");
//       }
//     } catch (err) {
//       console.error("Login Error:", err);
//       alert("Something went wrong while logging in.");
//     }
//   };

//   // ✅ Go to Home Page
//   const handleGoHome = () => {
//     navigate("/");
//   };

//   // ✅ Go to Register Page
//   const handleGoToRegister = () => {
//     navigate("/register");
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative w-full max-w-md rounded-xl bg-white/70 p-8 shadow-xl backdrop-blur-lg">
//         {/* Background Image */}
//         <div className="absolute inset-0 -z-10">
//           <img
//             src="https://images.unsplash.com/photo-1503736334956-4c8f8e92946d"
//             alt="Background"
//             className="h-full w-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black/40"></div>
//         </div>

//         {/* Close button (back to Home) */}
//         <button
//           onClick={handleGoHome}
//           className="absolute right-4 top-4 text-white text-2xl hover:text-gray-300"
//         >
//           &times;
//         </button>

//         <h2 className="mb-2 text-center text-2xl font-bold text-white">
//           WELCOME BACK!
//         </h2>
//         <p className="mb-6 text-center text-sm text-gray-200">
//           Log in to activate special member pricing.
//         </p>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email Address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full rounded-md border border-gray-300 p-3 focus:border-black focus:outline-none text-white placeholder-gray-500"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full rounded-md border border-gray-300 p-3 focus:border-black focus:outline-none text-white placeholder-gray-500"
//           />
//           <button
//             type="submit"
//             className="w-full rounded-md bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
//           >
//             SUBMIT
//           </button>
//         </form>

//         <div className="my-4 flex items-center justify-center text-white">
//           <span className="mx-2">Or</span>
//         </div>

//         {/* Social login */}
//         <div className="flex flex-col gap-3">
//           <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-700 shadow hover:bg-gray-100">
//             <FcGoogle size={20} /> Continue with Google
//           </button>
//           <button className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-700 shadow hover:bg-gray-100">
//             <FaFacebook size={20} className="text-blue-600" /> Continue with Facebook
//           </button>
//         </div>

//         {/* Links */}
//         <div className="mt-4 text-center text-sm text-white">
//           <a href="#" className="hover:underline">
//             Forgot Password?
//           </a>
//         </div>
//         <div className="mt-2 text-center text-sm text-white">
//           Not a member?{" "}
//           <button
//             onClick={handleGoToRegister}
//             className="font-semibold hover:underline"
//           >
//             Join today
//           </button>
//         </div>
//         <div className="mt-1 text-center text-sm text-white">
//           Trade Professional?{" "}
//           <a href="#" className="hover:underline">
//             Click here
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Updated login function with better error handling and loading states
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`http://localhost:5001/users?email=${email}`);
      const users = await res.json();

      if (users.length === 0) {
        setError("⚠️ User not found. Please register first.");
        return;
      }

      const user = users[0];

      if (user.password === password) {
        setError("");
        setSuccess(true);
        
        // Store user data in localStorage or context
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        
        setTimeout(() => {
          setSuccess(false);
          navigate("/"); // Redirect to Home Page after login
        }, 2000);
      } else {
        setError("❌ Incorrect password. Try again.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong while logging in.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Go to Home Page
  const handleGoHome = () => {
    navigate("/");
  };

  // ✅ Go to Register Page
  const handleGoToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      {/* ✅ Success Popup (Top-Right Corner) */}
      {success && (
        <div className="fixed top-5 right-5 z-50">
          <div className="bg-white text-green-700 font-semibold px-6 py-4 rounded-xl shadow-lg border border-green-600 animate-bounce">
            ✅ Login Successful! Redirecting...
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md rounded-xl bg-white/70 p-8 shadow-xl backdrop-blur-lg">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://i.pinimg.com/736x/0f/06/94/0f06940bf546e59f61c2b9ae3e5298e4.jpg"
            alt="Background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Close button (back to Home) */}
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
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
        {/* Links */}
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