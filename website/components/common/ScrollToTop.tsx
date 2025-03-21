"use client";
import { ArrowUpOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

type Props = {};

const ScrollToTop = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Function to handle scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to toggle visibility based on scroll position
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  // Timeout ID to clear on component unmount
  let timeoutId: NodeJS.Timeout;

  // Reset inactivity timer
  const resetInactivityTimer = () => {
    setIsActive(true);
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      setIsActive(false);
    }, 5000);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    // Add activity listeners
    const activityEvents = ["scroll", "mousemove", "keydown"];

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer)
    );

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      {isVisible && isActive && (
        <button
          onClick={handleScrollToTop}
          className="fixed z-40 grid place-items-center bottom-4 right-4 bg-secondaryShade text-white p-3 rounded-full shadow-md hover:bg-secondaryShadeDark transition-all duration-300 w-12 h-12"
        >
          <ArrowUpOutlined />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
