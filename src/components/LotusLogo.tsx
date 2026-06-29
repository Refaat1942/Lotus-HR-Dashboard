export function LotusLogo({ className = "h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="24" fill="#8DC63F" opacity="0.2" />
      <path
        d="M30 12 C20 12 14 20 14 28 C14 38 22 44 30 48 C38 44 46 38 46 28 C46 20 40 12 30 12Z"
        fill="#8DC63F"
      />
      <path
        d="M30 18 C24 18 20 24 20 30 C20 36 24 40 30 42 C36 40 40 36 40 30 C40 24 36 18 30 18Z"
        fill="#083F23"
      />
      <text x="62" y="28" fill="#083F23" fontFamily="Cairo, sans-serif" fontSize="22" fontWeight="700">
        Lotus
      </text>
      <text x="62" y="46" fill="#8DC63F" fontFamily="Cairo, sans-serif" fontSize="11" fontWeight="500">
        Pharmacies
      </text>
    </svg>
  );
}
