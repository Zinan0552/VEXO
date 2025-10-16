import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Left Logo & About */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-wider">
              VEXO ICONIC
            </h1>
            <p className="text-sm leading-relaxed text-gray-400">
              Luxury-grade craftsmanship, and relentless edge into every piece 
              made for those who refuse to blend in. The New Wave of Indian 
              Fashion Starts Here.
            </p>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Help and Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">About us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Top Selling */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top Selling</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Men&apos;s Apparel</a></li>
              <li><a href="#" className="hover:text-white">Women&apos;s Apparel</a></li>
              <li><a href="#" className="hover:text-white">Weightlifting Gear</a></li>
              <li><a href="#" className="hover:text-white">Combat Equipments</a></li>
              <li><a href="#" className="hover:text-white">Login</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Xtremex. Powered by Shopify</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
