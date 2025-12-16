import Link from "next/link";
import {
  FiUser,
  FiSettings,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiActivity,
  FiShoppingCart as FiCart,
  FiAward,
  FiStar,
} from "react-icons/fi";

export default function Sidebar({ user, activeTab, onTabChange, stats }) {
  const menuItems = [
    { id: "overview", icon: FiActivity, label: "نمای کلی", badge: null },
    { id: "cart", icon: FiCart, label: "سبد خرید", badge: stats.cartItems },
    {
      id: "orders",
      icon: FiShoppingBag,
      label: "سفارش‌ها",
      badge: stats.pendingOrders,
    },
    {
      id: "wishlist",
      icon: FiHeart,
      label: "علاقه‌مندی‌ها",
      badge: stats.wishlistItems,
    },
    { id: "addresses", icon: FiMapPin, label: "آدرس‌ها", badge: null },
    { id: "payments", icon: FiCreditCard, label: "پرداخت‌ها", badge: null },
  ];

  return (
    <div className="hidden lg:block w-80 flex-shrink-0">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 sticky top-8">
        {/* User Profile Card */}
        <div className="text-center mb-8 pb-6 border-b border-gray-200">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
            {user?.firstName?.[0] || "U"}
          </div>
          <h2 className="font-bold text-gray-900 text-xl">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <div className="flex items-center text-amber-400">
              <FiStar className="w-4 h-4 fill-current" />
              <FiStar className="w-4 h-4 fill-current" />
              <FiStar className="w-4 h-4 fill-current" />
              <FiStar className="w-4 h-4 fill-current" />
              <FiStar className="w-4 h-4 fill-current" />
            </div>
            <span className="text-gray-500 text-xs">سطح طلایی</span>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-4 py-4 text-right rounded-2xl transition-all duration-300 group ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-r-2 border-blue-500 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <item.icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    activeTab === item.id ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activeTab === item.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-gray-200">
            <Link
              href="/user/profile"
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-4 text-right rounded-2xl transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
            >
              <FiUser className="w-5 h-5 text-gray-400 transition-transform group-hover:scale-110" />
              <span className="font-medium">پروفایل کاربری</span>
            </Link>

            <Link
              href="/user/settings"
              className="w-full flex items-center space-x-3 space-x-reverse px-4 py-4 text-right rounded-2xl transition-all duration-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group"
            >
              <FiSettings className="w-5 h-5 text-gray-400 transition-transform group-hover:scale-110" />
              <span className="font-medium">تنظیمات پیشرفته</span>
            </Link>
          </div>
        </nav>

        {/* Upgrade Card */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
          <div className="text-center">
            <FiAward className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-gray-900 text-sm font-medium">
              ارتقا به سطح پلاتینی
            </p>
            <p className="text-gray-600 text-xs mt-1">دسترسی به امکانات ویژه</p>
            <button className="mt-3 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
              ارتقا حساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
