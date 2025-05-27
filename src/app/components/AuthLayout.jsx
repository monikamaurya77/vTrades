// src/components/AuthLayout.js
"use client"; // Essential for Next.js Image component and client-side hooks

import React from "react";
import Image from "next/image";

const AuthLayout = ({ children }) => {
  return (
    // Main container for the entire screen. Uses flexbox to create two columns.
    <div className="flex w-full h-screen bg-background gap-8">
      <div className="">
        <div className="">
          <Image
            src="/assets/Group.png"
            alt="Workhive background with welcome text"
            style={{ height: "90vh", width: "40vw" }} // Scale the image to cover the entire content box, maintaining aspect ratio
            quality={100} // Set quality to 100 for maximum clarity, especially if text is embedded
            priority // Load this image with high priority as it's a large visual element for LCP
            sizes="(max-width: 1024px) 0vw, 50vw"
            width={720}
            height={744}
          />
        </div>
      </div>

      <div className="w-full  flex justify-center items-center p-4">
        <div className="bg-card p-8 rounded-xl shadow-lg w-full ">
          {children}{" "}
          {/* This is the placeholder for your individual page content (SignInPage, SignUpPage, etc.) */}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
