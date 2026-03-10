"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { FaArrowLeft } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineAttachMoney } from "react-icons/md";
import { PiMoneyWavy } from "react-icons/pi";
import { HiOutlineUserGroup } from "react-icons/hi";
import { CiFileOn } from "react-icons/ci";
import { BsCalendarCheck } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <div className="flex min-h-full flex-col items-start bg-white is-drawer-close:w-14 is-drawer-open:w-64">
      <ul className="menu w-full grow">
        <li>
          <Link
            href="/"
            className="flex items-center gap-3 is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Homepage"
          >
            <FaArrowLeft />
            <span className="is-drawer-close:hidden">HomePage</span>
          </Link>

          <Link
            href="/dashboard"
            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
              pathname === "/dashboard" ? "bg-primary text-primary-content" : ""
            }`}
            data-tip="Dashboard Home"
          >
            <IoHomeOutline
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            />
            <span className="is-drawer-close:hidden">Dashboard Home</span>
          </Link>

          {userRole === "user" && (
            <>
              <Link
                href="/dashboard/my-bookings"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  pathname.startsWith("/dashboard/my-bookings")
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
                data-tip="My Bookings"
              >
                <BsCalendarCheck
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                />
                <span className="is-drawer-close:hidden">My Bookings</span>
              </Link>

              <Link
                href="/dashboard/my-payments"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  pathname === "/dashboard/my-payments"
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
                data-tip="My Payments"
              >
                <PiMoneyWavy
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                />
                <span className="is-drawer-close:hidden">My Payments</span>
              </Link>
            </>
          )}

          {userRole === "admin" && (
            <>
              <Link
                href="/dashboard/payments"
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  pathname === "/dashboard/payments"
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
                data-tip="All Payments"
              >
                <MdOutlineAttachMoney
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                />
                <span className="is-drawer-close:hidden">All Payments</span>
              </Link>

              <Link
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  pathname === "/dashboard/all-bookings"
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
                data-tip="All Bookings"
                href={"/dashboard/all-bookings"}
              >
                <CiFileOn
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                />
                <span className="is-drawer-close:hidden">All Bookings</span>
              </Link>

              <Link
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
                  pathname === "/dashboard/users"
                    ? "bg-primary text-primary-content"
                    : ""
                }`}
                data-tip="User Management"
                href={"/dashboard/users"}
              >
                <HiOutlineUserGroup
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4"
                />
                <span className="is-drawer-close:hidden">User Management</span>
              </Link>
            </>
          )}
          <Link
            className={`is-drawer-close:tooltip is-drawer-close:tooltip-right ${
              pathname === "/dashboard/myProfile"
                ? "bg-primary text-primary-content"
                : ""
            }`}
            data-tip="My Profile"
            href={"/dashboard/myProfile"}
          >
            <CgProfile
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            ></CgProfile>
            <span className="is-drawer-close:hidden">My Profile</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}