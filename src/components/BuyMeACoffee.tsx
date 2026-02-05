"use client";

import { useState, useEffect } from "react";
import { Coffee, X, Heart } from "@phosphor-icons/react";

export function BuyMeACoffee() {
  const [isOpen, setIsOpen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      // Cleanup any pending timeouts
      setShowFallback(false);
    };
  }, []);

  const handleBuyMeACoffee = () => {
    // Simple approach - let the browser handle the link naturally
    // The fallback will only show if the user manually blocks popups
    setIsOpen(false);
  };

  const handleMenuClose = () => {
    setIsOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("https://ko-fi.com/ali978412");
      setShowFallback(false);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="bg-[#29abe0] hover:bg-[#1f8bb8] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#29abe0] focus:ring-offset-2"
        aria-label="Support options"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isOpen ? (
          <X size={24} weight="bold" />
        ) : (
          <Coffee size={24} weight="bold" />
        )}
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[200px] animate-in slide-in-from-bottom-2 duration-200 z-10"
          role="dialog"
          aria-labelledby="support-title"
          aria-describedby="support-description"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-[#29abe0] rounded-full flex items-center justify-center">
              <Heart size={16} weight="fill" className="text-white" />
            </div>
            <div>
              <h3
                id="support-title"
                className="font-semibold text-gray-900 text-sm"
              >
                Support the Blog
              </h3>
              <p id="support-description" className="text-xs text-gray-500">
                Help keep the coffee flowing
              </p>
            </div>
          </div>

          <a
            href="https://ko-fi.com/ali978412"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBuyMeACoffee}
            className="w-full bg-[#29abe0] hover:bg-[#1f8bb8] text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer text-center no-underline focus:outline-none focus:ring-2 focus:ring-[#29abe0] focus:ring-offset-1"
            aria-label="Support on Ko-fi"
          >
            <Coffee size={16} />
            Buy Me a Coffee
          </a>

          <div className="mt-2 text-xs text-gray-500 text-center">
            ☕ Every cup helps!
          </div>
        </div>
      )}

      {/* Fallback Message */}
      {showFallback && (
        <div className="absolute bottom-16 right-0 bg-yellow-50 border border-yellow-200 rounded-lg shadow-xl p-4 min-w-[250px] animate-in slide-in-from-bottom-2 duration-200 z-20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 text-xs font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-800 text-sm mb-1">
                Popup Blocked
              </h4>
              <p className="text-yellow-700 text-xs mb-2">
                Please allow popups or copy the link below:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="https://ko-fi.com/ali978412"
                  readOnly
                  className="flex-1 text-xs p-1 border border-yellow-300 rounded bg-white"
                  aria-label="Ko-fi support link"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-800 text-xs rounded transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-500"
                  aria-label="Copy link to clipboard"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={handleMenuClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
