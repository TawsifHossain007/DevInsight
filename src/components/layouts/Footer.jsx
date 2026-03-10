import Link from "next/link";
import React from "react";


const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center text-base-content rounded bg-base-300 p-10 mt-20">
      {/* Navigation Links */}
      <nav className="grid grid-flow-col gap-4">
        <Link href={"/blogs"} className="link link-hover">
          Blogs
        </Link>
        <Link href={"/about"} className="link link-hover">
          About us
        </Link>
        <Link href={"/contact"} className="link link-hover">
          Contact us
        </Link>
      </nav>

      {/* Social Icons */}
      <nav>
        <div className="grid grid-flow-col gap-4">
          {/* X (Twitter) */}
          <a
            href="https://x.com/tawsif_hos62406"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775 1.014-.611 1.794-1.576 2.163-2.723-.951.563-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/the_hossain_shaheb/" // <-- Replace with your Instagram profile
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.31.975.975 1.248 2.242 1.31 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.31 3.608-.975.975-2.242 1.248-3.608 1.31-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.31-.975-.975-1.248-2.242-1.31-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.31-3.608.975-.975 2.242-1.248 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.773.129 4.602.42 3.635 1.386 2.667 2.353 2.376 3.524 2.319 4.803 2.261 6.083 2.247 6.492 2.247 12s.014 5.917.072 7.197c.058 1.279.349 2.45 1.316 3.417.967.967 2.138 1.258 3.417 1.316 1.28.058 1.689.072 7.197.072s5.917-.014 7.197-.072c1.279-.058 2.45-.349 3.417-1.316.967-.967 1.258-2.138 1.316-3.417.058-1.28.072-1.689.072-7.197s-.014-5.917-.072-7.197c-.058-1.279-.349-2.45-1.316-3.417C21.45.42 20.279.129 19 .072 17.719.014 17.31 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
            </svg>
          </a>

          {/* LinkedIn (unchanged) */}
          <a
            href="https://www.linkedin.com/in/tawsif-hossain007/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.225.792 24 1.771 24h20.451C23.2 24 24 23.225 24 22.271V1.729C24 .774 23.2 0 22.225 0zM7.082 20.452H3.543V9h3.539v11.452zM5.313 7.433c-1.137 0-2.057-.928-2.057-2.072 0-1.144.92-2.072 2.057-2.072s2.057.928 2.057 2.072c0 1.144-.92 2.072-2.057 2.072zm15.138 13.019h-3.539v-5.605c0-1.336-.025-3.058-1.865-3.058-1.868 0-2.154 1.458-2.154 2.966v5.697h-3.539V9h3.396v1.561h.048c.473-.897 1.632-1.844 3.36-1.844 3.593 0 4.254 2.365 4.254 5.439v6.296z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Copyright */}
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All rights reserved by CareNest
          Industries Ltd
        </p>
      </aside>
    </footer>
  );
};

export default Footer;