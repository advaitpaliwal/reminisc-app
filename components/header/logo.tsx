import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LinkProps } from "next/link";
import { cn } from "@/lib/utils";

export type LogoProps = {
  height?: number;
  width?: number;
  className?: string;
};

const ReminiscLogo = ({ height, width, className }: LogoProps) => {
  return (
    <div className={cn("flex cursor-pointer justify-between", className)}>
      <div className="items-center">
        <Link
          href="/"
          rel="nofollow"
          className="flex items-center space-x-2 dark:hidden"
        >
          <Image
            src="/reminisc-light.png"
            alt="ReminiscLogo"
            width={width || 24}
            height={height || 24}
            unoptimized
          />
        </Link>
        <Link
          href="/"
          rel="nofollow"
          className="hidden items-center space-x-2 dark:flex"
        >
          <Image
            src="/reminisc-dark.png"
            alt="ReminiscLogo"
            width={width || 24}
            height={height || 24}
            unoptimized
          />
        </Link>
      </div>
    </div>
  );
};

export default ReminiscLogo;
