export default function Icon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="16" cy="16" r="16" fill="#7f5539" />
      
      {/* Coffee cup body */}
      <path
        d="M10 12h10c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2H10c-1.1 0-2-.9-2-2v-6c0-1.1.9-2 2-2z"
        fill="#e6ccb2"
        stroke="#9c6644"
        strokeWidth="1.5"
      />
      
      {/* Coffee cup handle */}
      <path
        d="M20 14c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2"
        stroke="#e6ccb2"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Coffee surface/steam */}
      <ellipse cx="15" cy="13" rx="4" ry="1" fill="#9c6644" opacity="0.8" />
      <path
        d="M13 10c0-1 1-1 2-1s2 0 2 1"
        stroke="#e6ccb2"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
