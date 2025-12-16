import { FiBell, FiMenu, FiChevronDown } from "react-icons/fi";

export default function Header({ user, onMenuClick }) {
  return (
    <header className="lg:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
          >
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">پنل کاربری</h1>
          <div className="flex items-center space-x-3 space-x-reverse">
            <button className="relative p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <FiBell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-medium shadow-sm">
              {user?.firstName?.[0] || "U"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
