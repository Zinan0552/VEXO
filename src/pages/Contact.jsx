import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-red-600 tracking-tight">
          Contact Us
        </h1>
        <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
          We're here to help you with your questions, orders, or any support you
          need. Reach out anytime — our team will respond quickly.
        </p>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl w-full">
        {/* Contact Form */}
        <div className="bg-zinc-900 rounded-2xl p-8 shadow-lg border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 text-red-500">
            Send us a message
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full rounded-md bg-black border border-zinc-700 focus:border-red-500 text-white p-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md bg-black border border-zinc-700 focus:border-red-500 text-white p-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Message
              </label>
              <textarea
                placeholder="Write your message here..."
                rows="4"
                className="w-full rounded-md bg-black border border-zinc-700 focus:border-red-500 text-white p-3 outline-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-zinc-900 rounded-2xl p-8 shadow-lg border border-zinc-800 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-red-500">
            Get in Touch
          </h2>
          <ul className="space-y-6 text-gray-300">
            <li className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-sm">support@vexo.com</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-sm">+91 98765 43210</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-sm">
                  VEXO HQ, MG Road, Bengaluru, Karnataka, India
                </p>
              </div>
            </li>
          </ul>

          {/* Map (optional) */}
          <div className="mt-8 rounded-xl overflow-hidden border border-zinc-800">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.1918364028533!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670f53c7b47%3A0x9b4a9f6d9a!2sMG%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1670000000000!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
