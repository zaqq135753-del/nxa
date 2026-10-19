import React, { forwardRef } from "react";
import type { BubbleNavItem } from "./navigation.types";

interface NavigationItemProps {
  item: BubbleNavItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  showLabel?: boolean;
}

export const NavigationItem = forwardRef<HTMLButtonElement, NavigationItemProps>(
  ({ item, index, isActive, onClick, onKeyDown, showLabel = false }, ref) => {
    const IconComponent = item.icon;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`sbn-tab-${item.id}`}
        aria-selected={isActive}
        aria-controls={`sbn-tabpanel-${item.id}`}
        aria-label={item.label}
        tabIndex={isActive ? 0 : -1}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="sbn-item"
        data-index={index}
        data-id={item.id}
      >
        <span className="sbn-icon-container">
          <IconComponent
            size={22}
            className={`transition-colors duration-200 ${
              isActive ? "text-[#07090A] stroke-[2.5]" : "text-slate-300 stroke-[1.8]"
            }`}
            aria-hidden="true"
          />

          {item.badge !== undefined && (
            <span className="sbn-badge" aria-label={`${item.badge} notificações`}>
              {item.badge}
            </span>
          )}
        </span>

        {showLabel && (
          <span
            className={`text-[9px] font-bold tracking-tight transition-all duration-200 mt-0.5 ${
              isActive ? "text-[#07090A] opacity-100" : "text-slate-400 opacity-60"
            }`}
          >
            {item.label}
          </span>
        )}
      </button>
    );
  }
);

NavigationItem.displayName = "NavigationItem";
