import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconBrandLinkedin,
  IconShieldCheck,
  IconRefresh,
  IconHeadset,
} from '@tabler/icons-react';

function Footer() {
  return (
    <footer className="border-t border-orange-300">

      {/* Main footer */}
      <div className="px-8 md:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <img
              src="/images/Logo.png"
              alt="TORQUE"
              className="h-12 w-auto object-contain mb-5"
            />

            <p className="text-sm font-medium text-gray-900 leading-relaxed">
              Chase the adrenaline
              <br />
              with every drive.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-5">
              Navigation
            </p>

            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <Link to="/" className="hover:text-orange-600 transition">
                Home
              </Link>

              <Link to="/about" className="hover:text-orange-600 transition">
                About
              </Link>

              <Link to="/products" className="hover:text-orange-600 transition">
                Products
              </Link>

              <Link to="/cart" className="hover:text-orange-600 transition">
                Cart
              </Link>

              <Link to="/wishlist" className="hover:text-orange-600 transition">
                Wishlist
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-5">
              Contact
            </p>

            <div className="flex flex-col gap-3 text-sm text-gray-500">
              <p>+91 7559 087713</p>
              <p>torque@gmail.com</p>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-gray-900 mb-5">
              Visit us
            </p>

            <p className="text-sm text-gray-500 leading-relaxed">
              TORQUE RC
              <br />
              Kinfra,6th floor
              <br/>
              Kakkancheri
              <br/>
              Kerala, India
              <br />
              673330
            </p>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
    <div className="bg-orange-600 px-8 md:px-16 py-5">
  <div className="flex flex-col md:flex-row items-center justify-between gap-6">

    {/* Benefits */}
    <div className="flex flex-wrap items-center justify-center gap-10">

      <div className="flex items-center gap-3">
        <IconShieldCheck
          size={22}
          className="text-white"
          stroke={1.5}
        />
        <div>
          <p className="text-white text-xs font-medium">
            Secure payments
          </p>
          <p className="text-white/70 text-[11px]">
            Protected checkout
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <IconRefresh
          size={22}
          className="text-white"
          stroke={1.5}
        />
        <div>
          <p className="text-white text-xs font-medium">
            Easy returns
          </p>
          <p className="text-white/70 text-[11px]">
            30-day hassle free
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <IconHeadset
          size={22}
          className="text-white"
          stroke={1.5}
        />
        <div>
          <p className="text-white text-xs font-medium">
            Expert support
          </p>
          <p className="text-white/70 text-[11px]">
            We're here to help
          </p>
        </div>
      </div>

    </div>

    {/* Copyright + social */}
    <div className="flex items-center gap-5">

      <p className="text-xs text-white/80">
        © 2026 TORQUE
      </p>

      <div className="flex items-center gap-4 text-white">
        <button className="hover:opacity-70 transition">
          <IconBrandLinkedin size={18} />
        </button>

        <button className="hover:opacity-70 transition">
          <IconBrandInstagram size={18} />
        </button>

        <button className="hover:opacity-70 transition">
          <IconBrandFacebook size={18} />
        </button>
      </div>

    </div>

  </div>
</div>

    </footer>
  );
}

export default Footer;