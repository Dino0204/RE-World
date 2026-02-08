"use client";

import { useState } from "react";

const navItems = ["PLAY", "CUSTOMIZE", "ARMORY", "RECORDS", "SYSTEM"];

export const Header = () => {
  const [activeTab, setActiveTab] = useState("PLAY");

  return (
    <div className="relative z-20 w-full h-16 border-b-2 border-brand-beige-dark flex items-center px-8 justify-between bg-brand-beige/80 backdrop-blur-sm">
      {/* Tabs */}
      <div className="flex items-end h-full gap-2">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`
                relative px-6 h-10 flex items-center justify-center text-xs tracking-widest transition-all duration-300 font-bold group
                ${activeTab === item ? "bg-brand-charcoal text-brand-beige" : "bg-brand-beige-mid text-brand-charcoal-light hover:bg-brand-beige-hover hover:text-brand-charcoal"}
              `}
          >
            {/* Decorative square */}
            <div
              className={`absolute top-1 left-1 w-1 h-1 transition-colors ${activeTab === item ? "bg-brand-beige" : "bg-brand-charcoal-light group-hover:bg-brand-charcoal"}`}
            ></div>
            {item}
          </button>
        ))}
      </div>

      {/* Top Right Info */}
      <div className="flex items-center gap-4 text-xs font-bold text-brand-charcoal-muted">
        <span className="flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-charcoal rounded-full animate-pulse"></div>{" "}
          ONLINE
        </span>
        <span className="opacity-30 mx-2">|</span>
        <span>VER. 9.02.4</span>
      </div>
    </div>
  );
};
