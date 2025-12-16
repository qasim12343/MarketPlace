import Link from "next/link";
import {
  FiX,
  FiUser,
  FiSettings,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiActivity,
  FiShoppingCart as FiCart,
} from "react-icons/fi";

export default function MobileSidebar({
  user,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) {
  const menuItems = [
    { id: "overview", icon: FiActivity, label: "نمای کلی" },
    { id: "cart", icon: FiCart, label: "سبد خرید" },
    { id: "orders", icon: FiShoppingBag, label: "سفارش‌ها" },
    { id: "wishlist", icon: FiHeart, label: "علاقه‌مندی‌ها" },
    { id: "addresses", icon: FiMapPin, label: "آدرس‌ها" },
    { id: "payments", icon: FiCreditCard, label: "پرداخت‌ها" },
  ];

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-xl border-l border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">منو</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile User Profile */}
          <div className="text-center mb-8 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
              {user?.firstName?.[0] || "U"}
            </div>
            <h2 className="font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-4 text-right rounded-2xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeTab === item.id ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
