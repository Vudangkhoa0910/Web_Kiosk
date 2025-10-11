// React icons collection

// Một bộ icon tùy chỉnh thống nhất với màu sắc và phong cách đồng bộ
export const IconSet = {
  // Navigation Icons
  Home: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 9.5L12 2.5L21 9.5V20.5C21 21.6 20.1 22.5 19 22.5H5C3.9 22.5 3 21.6 3 20.5V9.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 22.5V12.5H15V22.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  Robot: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="4"
        y="8"
        width="16"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="8.5" cy="14" r="1.5" fill={color} />
      <circle cx="15.5" cy="14" r="1.5" fill={color} />
      <path
        d="M9 18h6M12 8V5M10 5h4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  Map: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="10" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  ),

  Cart: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  Orders: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M14 2V8H20M16 13H8M16 17H8M10 9H8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // Status Icons
  Battery: ({ className = "w-6 h-6", color = "currentColor", level = 100 }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="2"
        y="6"
        width="16"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <rect
        x="4"
        y="8"
        width={`${(level / 100) * 12}`}
        height="8"
        rx="1"
        fill={level > 50 ? "#10b981" : level > 20 ? "#f59e0b" : "#ef4444"}
      />
      <path d="M22 9V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  Lightning: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity="0.1"
      />
    </svg>
  ),

  Navigation: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 11L22 2L13 21L11 13L3 11Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  Clock: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill="none" />
      <path
        d="M12 6V12L16 14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Check: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 6L9 17L4 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Star: ({ className = "w-6 h-6", color = "currentColor", filled = false }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : "none"}
      />
    </svg>
  ),

  Search: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" fill="none" />
      <path
        d="M21 21L16.65 16.65"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Filter: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  Plus: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 5V19M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Minus: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M5 12H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  Settings: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" />
      <path
        d="M19.4 15C19.2 15.3 19.2 15.7 19.4 16L20.1 17.1C20.4 17.6 20.3 18.2 19.9 18.6L18.6 19.9C18.2 20.3 17.6 20.4 17.1 20.1L16 19.4C15.7 19.2 15.3 19.2 15 19.4C14.7 19.6 14.4 19.8 14.1 20C13.8 20.2 13.7 20.6 13.7 21L13.4 22.2C13.3 22.7 12.9 23.1 12.4 23.1H11.6C11.1 23.1 10.7 22.7 10.6 22.2L10.3 21C10.3 20.6 10.2 20.2 9.9 20C9.6 19.8 9.3 19.6 9 19.4C8.7 19.2 8.3 19.2 8 19.4L6.9 20.1C6.4 20.4 5.8 20.3 5.4 19.9L4.1 18.6C3.7 18.2 3.6 17.6 3.9 17.1L4.6 16C4.8 15.7 4.8 15.3 4.6 15C4.4 14.7 4.2 14.4 4 14.1C3.8 13.8 3.4 13.7 3 13.7L1.8 13.4C1.3 13.3 0.9 12.9 0.9 12.4V11.6C0.9 11.1 1.3 10.7 1.8 10.6L3 10.3C3.4 10.3 3.8 10.2 4 9.9C4.2 9.6 4.4 9.3 4.6 9C4.8 8.7 4.8 8.3 4.6 8L3.9 6.9C3.6 6.4 3.7 5.8 4.1 5.4L5.4 4.1C5.8 3.7 6.4 3.6 6.9 3.9L8 4.6C8.3 4.8 8.7 4.8 9 4.6C9.3 4.4 9.6 4.2 9.9 4C10.2 3.8 10.3 3.4 10.3 3L10.6 1.8C10.7 1.3 11.1 0.9 11.6 0.9H12.4C12.9 0.9 13.3 1.3 13.4 1.8L13.7 3C13.7 3.4 13.8 3.8 14.1 4C14.4 4.2 14.7 4.4 15 4.6C15.3 4.8 15.7 4.8 16 4.6L17.1 3.9C17.6 3.6 18.2 3.7 18.6 4.1L19.9 5.4C20.3 5.8 20.4 6.4 20.1 6.9L19.4 8C19.2 8.3 19.2 8.7 19.4 9C19.6 9.3 19.8 9.6 20 9.9C20.2 10.2 20.6 10.3 21 10.3L22.2 10.6C22.7 10.7 23.1 11.1 23.1 11.6V12.4C23.1 12.9 22.7 13.3 22.2 13.4L21 13.7C20.6 13.7 20.2 13.8 20 14.1C19.8 14.4 19.6 14.7 19.4 15Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  ),

  Phone: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.271 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59344 1.99522 8.06477 2.16708 8.43828 2.48353C8.81179 2.79999 9.06 3.23945 9.12999 3.72C9.26382 4.68007 9.4997 5.62273 9.82999 6.53C9.95214 6.88792 9.97097 7.27691 9.8845 7.64632C9.79804 8.01573 9.60993 8.35049 9.33999 8.62L8.08999 9.87C9.51355 12.4135 11.5865 14.4864 14.13 15.91L15.38 14.66C15.6495 14.3901 15.9843 14.2019 16.3537 14.1155C16.7231 14.0291 17.1121 14.0479 17.47 14.17C18.3773 14.5003 19.3199 14.7362 20.28 14.87C20.7658 14.9398 21.2094 15.1917 21.5265 15.5689C21.8437 15.9462 22.0122 16.4207 22 16.92Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  ),

  Eye: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  ),

  User: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  ),

  Package: ({ className = "w-6 h-6", color = "currentColor" }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M21 8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69752 20.3037 6.44536 20 6.27L12.5 2.27C12.1973 2.09446 11.8511 2.00006 11.4985 2.00006C11.1459 2.00006 10.7997 2.09446 10.497 2.27L3 6.27C2.69638 6.44536 2.44407 6.69752 2.26854 7.00116C2.09301 7.30481 2.00041 7.64927 2 8V16C2.00041 16.3507 2.09301 16.6952 2.26854 16.9988C2.44407 17.3025 2.69638 17.5546 3 17.73L10.5 21.73C10.8027 21.9055 11.1489 21.9999 11.5015 21.9999C11.8541 21.9999 12.2003 21.9055 12.503 21.73L20 17.73C20.3036 17.5546 20.5559 17.3025 20.7315 16.9988C20.907 16.6952 20.9996 16.3507 21 16V8Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M2.27 6.96L12 12.01L21.73 6.96M12 22.08V12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default IconSet;
