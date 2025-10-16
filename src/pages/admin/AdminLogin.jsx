// // import React, { useState } from 'react';
// // import { useAuth } from '../../context/AuthContext';
// // import { useNavigate } from 'react-router-dom';
// // import { ToastContainer, toast } from 'react-toastify';

// // const AdminLogin = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
  
// //   const { login } = useAuth();
// //   const navigate = useNavigate();

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     const result = await login(email, password, true);
    
// //     if (result.success) {
// //       toast.success('Welcome to Admin Panel!');
// //       navigate('/admin');
// //     } else {
// //       toast.error(result.error || 'Login failed');
// //     }
    
// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// //       <ToastContainer />
// //       <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
// //         <div className="text-center mb-8">
// //           <h1 className="text-3xl font-bold text-gray-800">VEXO ICONIC</h1>
// //           <p className="text-gray-600 mt-2">Admin Panel Login</p>
// //         </div>

// //         <form onSubmit={handleSubmit} className="space-y-6">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Email Address
// //             </label>
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
// //               placeholder="admin@vexo.com"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-2">
// //               Password
// //             </label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
// //               placeholder="Enter your password"
// //             />
// //           </div>

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 transition-colors"
// //           >
// //             {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
// //           </button>
// //         </form>

// //         <div className="mt-6 text-center">
// //           <p className="text-sm text-gray-600 mb-4">
// //             Demo credentials: admin@vexo.com / admin123
// //           </p>
// //           <button
// //             onClick={() => navigate('/')}
// //             className="text-red-600 hover:text-red-700 font-medium transition-colors"
// //           >
// //             ← Back to Store
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminLogin;

// import React, { useState } from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const result = await login(email, password, true);
    
//     if (result.success) {
//       toast.success('🔐 Welcome to Admin Panel!');
//       setTimeout(() => {
//         navigate('/admin');
//       }, 1500);
//     } else {
//       toast.error(result.error || '❌ Login failed');
//     }
    
//     setLoading(false);
//   };

//   const handleGoHome = () => {
//     navigate('/');
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   // Auto-fill demo credentials for testing
//   const fillDemoCredentials = () => {
//     setEmail('admin@vexo.com');
//     setPassword('admin123');
//     toast.info('Demo credentials filled!');
//   };

//   return (
//     <div 
//       className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
//       style={{
//         backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
//       }}
//     >
//       {/* Success Popup */}
      
//       <div className="relative w-full max-w-md rounded-xl bg-white/90 p-8 shadow-2xl backdrop-blur-sm border border-gray-200">
//         {/* Background Pattern */}
//         <div className="absolute inset-0 -z-10 opacity-5">
//           <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-purple-600"></div>
//         </div>

//         {/* Close button */}
//         <button
//           onClick={handleGoHome}
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl font-bold transition-colors"
//           disabled={loading}
//         >
//           &times;
//         </button>

//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex justify-center mb-4">
//             <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-lg">
//               <Shield className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">VEXO ADMIN</h1>
//           <p className="text-gray-600 text-sm">
//             Secure Admin Portal Access
//           </p>
//         </div>

//         {/* Demo Credentials Banner */}
//         <div 
//           className="mb-6 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white text-center text-sm cursor-pointer hover:shadow-md transition-shadow"
//           onClick={fillDemoCredentials}
//         >
//           <div className="flex items-center justify-center space-x-2">
//             <Lock className="w-4 h-4" />
//             <span>Click to auto-fill demo credentials</span>
//           </div>
//         </div>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Admin Email
//             </label>
//             <div className="relative">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/80"
//                 placeholder="admin@vexo.com"
//                 disabled={loading}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/80"
//                 placeholder="Enter admin password"
//                 disabled={loading}
//               />
//               <button
//                 type="button"
//                 onClick={togglePasswordVisibility}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
//                 disabled={loading}
//               >
//                 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center space-x-2">
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                 <span>SECURING ACCESS...</span>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center space-x-2">
//                 <Lock className="w-5 h-5" />
//                 <span>ACCESS ADMIN PANEL</span>
//               </div>
//             )}
//           </button>
//         </form>

//         {/* Security Notice */}
//         <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <div className="flex items-start space-x-3">
//             <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//             <div>
//               <h4 className="text-sm font-semibold text-blue-800 mb-1">Security Notice</h4>
//               <p className="text-xs text-blue-600">
//                 This area is restricted to authorized personnel only. All activities are monitored and logged.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer Links */}
//         <div className="mt-6 text-center space-y-3">
//           <div className="text-sm text-gray-600">
//             Need user access?{' '}
//             <button
//               onClick={() => navigate('/login')}
//               className="text-red-600 hover:text-red-700 font-semibold transition-colors"
//               disabled={loading}
//             >
//               Switch to User Login
//             </button>
//           </div>
          
//           <div className="pt-3 border-t border-gray-200">
//             <button
//               onClick={handleGoHome}
//               className="text-gray-500 hover:text-gray-700 text-sm transition-colors flex items-center justify-center space-x-1 mx-auto"
//               disabled={loading}
//             >
//               <span>←</span>
//               <span>Return to Store</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="light"
//       />
//     </div>
//   );
// };

// export default AdminLogin;