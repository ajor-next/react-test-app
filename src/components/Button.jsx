
const PrimaryRoundedButtonWithIcon = () => {
  return (
    <button className='bg-red-500 border-red-400 border rounded-lg inline-flex items-center justify-center py-2 px-7 text-center text-base hover:bg-red-600 hover:border-red-600 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5 active:bg-red-600 active:border-red-600 font-semibold text-white w-full'>
      <span className='mr-[10px]'>
      <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        strokeWidth={32}
        transform="rotate(-45 312.002 311.994)"
        d="M311.995 122.9 H311.995 A31.515 31.52 0 0 1 343.51 154.42000000000002 V469.58000000000004 A31.515 31.52 0 0 1 311.995 501.1 H311.995 A31.515 31.52 0 0 1 280.48 469.58000000000004 V154.42000000000002 A31.515 31.52 0 0 1 311.995 122.9 z"
      />
      <path d="M178.38 178.38a31.64 31.64 0 000 44.75L223.25 268 268 223.25l-44.87-44.87a31.64 31.64 0 00-44.75 0z" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M48 192h48M90.18 90.18l33.94 33.94M192 48v48M293.82 90.18l-33.94 33.94M124.12 259.88l-33.94 33.94"
      />
    </svg>
      </span>
      Create Color
    </button>
  )
}

export default PrimaryRoundedButtonWithIcon