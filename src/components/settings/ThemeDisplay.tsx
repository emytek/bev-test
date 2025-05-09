"use client";

import { useTheme } from "../../context/ThemeContext";
import { useState, useEffect } from "react";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";

const DisplaySettings = () => {
  const { theme, toggleTheme } = useTheme();
  const [isEnabled, setIsEnabled] = useState(theme === "dark");

  useEffect(() => {
    setIsEnabled(theme === "dark");
  }, [theme]);

  const handleToggle = () => {
    toggleTheme();
    setIsEnabled(!isEnabled);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Choose Display Mode
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Customize your dashboard appearance to match your preference. Select between a
        light and a dark theme for optimal viewing comfort.
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isEnabled ? (
            <BsMoonStarsFill className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <BsSunFill className="h-5 w-5 text-yellow-500" />
          )}
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isEnabled ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
        <button
          onClick={handleToggle}
          className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none ${
            isEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-700"
          }`}
          aria-checked={isEnabled}
          aria-labelledby="theme-toggle-label"
        >
          <span className="sr-only" id="theme-toggle-label">
            Toggle display mode
          </span>
          <span
            className={`inline-block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
              isEnabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default DisplaySettings;