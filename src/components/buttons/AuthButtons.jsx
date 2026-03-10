"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Swal from "sweetalert2";

const AuthButtons = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut();
    Swal.fire({
      title: "Logged Out",
      text: "See you soon!",
      icon: "success",
      confirmButtonColor: "oklch(62% 0.14 230)"
    });
  };

  return (
    <div>
      {status === "authenticated" ? (
        <div className="flex items-center gap-3">
          {/* Avatar Dropdown */}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <Image src={user.image} alt="User Avatar" width={40} height={40} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content z-999 menu p-4 shadow-lg bg-base-100 rounded-xl w-72 
                backdrop-blur-lg border border-base-300"
              >
                <li className="text-center flex flex-col items-center">
                  <Image
                    src={user.image}
                    className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-200 ring-offset-2 mb-2"
                    alt="User"
                    width={96}
                    height={96}
                  />

                  <h3 className="font-bold text-lg text-secondary">
                    {user.name}
                  </h3>
                  <span
                    className={`badge ${
                      user.role === "admin"
                        ? "badge-primary"
                        : user.role === "user"
                          ? "badge-ghost"
                          : "badge-info"
                    } font-semibold capitalize`}
                  >
                    {user.role}
                  </span>
                  <p className="text-sm opacity-70">{user.email}</p>
                </li>

                <div className="divider"></div>

                <li>
                  <button
                    onClick={handleLogout}
                    className="btn btn-primary btn-outline w-full"
                  >
                    Logout
                  </button>
                </li>
                <Link
                  href={"/dashboard/myProfile"}
                  className="btn btn-primary btn-outline w-full mt-2"
                >
                  My Profile
                </Link>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login" className="btn btn-primary btn-outline">
          Login
        </Link>
      )}
    </div>
  );
};

export default AuthButtons;