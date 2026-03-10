"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineDashboard } from "react-icons/md";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import NavLink from "../buttons/NavLink";
import Logo from "./Logo";
import AuthButtons from "../buttons/AuthButtons";

const Navbar = () => {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to devinsight
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "devinsight";
    }
    return "devinsight";
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "devinsight" ? "devinsight-dark" : "devinsight";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const nav = (
    <>
      <li>
        <NavLink href={"/"}>Home</NavLink>
      </li>
      <li>
        <NavLink href={"/aboutUs"}>About US</NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-200 p-3 rounded-2xl">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {nav}
          </ul>
        </div>
        <Logo></Logo>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{nav}</ul>
      </div>
      <div className="navbar-end space-x-4">
        {/* Theme Toggle */}
        <label className="swap swap-rotate btn btn-ghost btn-circle hover:bg-transparent border-none focus:outline-none">
          <input
            type="checkbox"
            checked={theme === "devinsight-dark"}
            onChange={toggleTheme}
            className="hidden"
          />
          {/* Sun icon */}
          <MdLightMode className="swap-off fill-primary w-6 h-6" />
          {/* Moon icon */}
          <MdDarkMode className="swap-on fill-primary w-6 h-6" />
        </label>

        <AuthButtons></AuthButtons>
      </div>
    </div>
  );
};

export default Navbar;
