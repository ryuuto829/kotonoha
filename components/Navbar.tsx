export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full shadow-[0_-1px_0_inset_rgba(47,47,47)] bg-[rgb(25,25,25)]">
      <nav className="h-14 flex justify-between items-center">
        <div>Logo</div>
        <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <svg
            className="absolute w-12 h-12 text-gray-400 -left-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
      </nav>
    </header>
  )
}
