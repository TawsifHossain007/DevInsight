"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavLink = ({href,children}) => {
    const path = usePathname()
    const isActive =
    href === "/"
      ? path === "/"
      : path.startsWith(href);

    return (
        <Link
      href={href}
      className={`${isActive ? "text-primary bg-base-100" : "text-neutral"} font-medium hover:text-primary transition-colors`}
    >
      {children}
    </Link>
    );
};

export default NavLink;