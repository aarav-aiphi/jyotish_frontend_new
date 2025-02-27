"use client";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectConnectingAstrologer, clearConnectingAstrologer } from "@/redux/chatSlice";
import React from "react";

/**
 * Global popup that appears if connectingAstrologer is not null
 */
export default function GlobalConnectingPopup() {
  const dispatch = useAppDispatch();
  const connectingAstrologer = useAppSelector(selectConnectingAstrologer);

  if (!connectingAstrologer) {
    return null; // no pop-up needed
  }

  const handleCancel = () => {
    // dispatch action to clear
    dispatch(clearConnectingAstrologer());
    // Optionally do any cleanup, e.g. cancel network request, etc.
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center 
                    bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <h2 className="text-lg font-bold mb-4">
          Connecting to {connectingAstrologer.name}
        </h2>
        <p className="mb-4">Please wait while we establish a connection...</p>
        <button
          onClick={handleCancel}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
