// app/user/dashboard/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiSettings,
  FiBell,
  FiCreditCard,
  FiMapPin,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiShoppingCart,
  FiEye,
  FiHome,
  FiBriefcase,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiLoader,
  FiMinus,
  FiPlusCircle,
  FiMinusCircle,
  FiGrid,
  FiPieChart,
  FiActivity,
  FiUsers,
  FiBox,
  FiShoppingCart as FiCart,
  FiGift,
  FiAward,
  FiZap,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    cartItems: 0,
    cartTotal: 0,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [activeTab, user]);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/user-session");
      const result = await response.json();

      if (!result.isAuthenticated || !result.user) {
        router.push("/user-login");
        return;
      }

      setUser(result.user);
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/user-login");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const cartResponse = await fetch("/api/cart");
      const cartData = await cartResponse.json();

      const wishlistResponse = await fetch("/api/wishlist");
      const wishlistData = await wishlistResponse.json();

      setStats({
        totalOrders: 12,
        pendingOrders: 2,
        completedOrders: 8,
        totalSpent: 12500000,
        wishlistItems: wishlistData.success
          ? wishlistData.wishlist?.itemCount || 0
          : 0,
        cartItems: cartData.success ? cartData.cart?.totalItems || 0 : 0,
        cartTotal: cartData.success ? cartData.cart?.totalPrice || 0 : 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalOrders: 12,
        pendingOrders: 2,
        completedOrders: 8,
        totalSpent: 12500000,
        wishlistItems: 0,
        cartItems: 0,
        cartTotal: 0,
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-300 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-light">
            در حال بارگذاری پنل کاربری...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300"
            >
              <FiMenu className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">پنل کاربری</h1>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-sm font-medium shadow">
              {user?.firstName?.[0] || "U"}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-8xl mx-auto lg:px-8 py-4 lg:py-8">
        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8 shadow-sm">
              {/* User Profile Card */}
              <div className="text-center mb-8 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-md relative">
                  {user?.firstName?.[0] || "U"}
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
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
                {[
                  {
                    id: "overview",
                    icon: FiActivity,
                    label: "نمای کلی",
                    badge: null,
                  },
                  {
                    id: "cart",
                    icon: FiCart,
                    label: "سبد خرید",
                    badge: stats.cartItems,
                  },
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
                  {
                    id: "addresses",
                    icon: FiMapPin,
                    label: "آدرس‌ها",
                    badge: null,
                  },
                  {
                    id: "payments",
                    icon: FiCreditCard,
                    label: "پرداخت‌ها",
                    badge: null,
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-4 text-right rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-r-2 border-blue-500 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <item.icon
                        className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                          activeTab === item.id
                            ? "text-blue-500"
                            : "text-gray-400"
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
                  <p className="text-gray-600 text-xs mt-1">
                    دسترسی به امکانات ویژه
                  </p>
                  <button className="mt-3 w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105">
                    ارتقا حساب
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
              ></div>
              <div className="absolute right-0 top-0 w-80 h-full bg-white border-l border-gray-200 shadow-xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">منو</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <FiX className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>

                  {/* Mobile User Profile */}
                  <div className="text-center mb-8 pb-6 border-b border-gray-200">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                      {user?.firstName?.[0] || "U"}
                    </div>
                    <h2 className="font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
                  </div>

                  <nav className="space-y-2">
                    {[
                      { id: "overview", icon: FiActivity, label: "نمای کلی" },
                      { id: "cart", icon: FiCart, label: "سبد خرید" },
                      { id: "orders", icon: FiShoppingBag, label: "سفارش‌ها" },
                      { id: "wishlist", icon: FiHeart, label: "علاقه‌مندی‌ها" },
                      { id: "addresses", icon: FiMapPin, label: "آدرس‌ها" },
                      {
                        id: "payments",
                        icon: FiCreditCard,
                        label: "پرداخت‌ها",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 space-x-reverse px-4 py-4 text-right rounded-2xl transition-all duration-200 ${
                          activeTab === item.id
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 ${
                            activeTab === item.id
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  پنل کاربری
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  مدیریت هوشمند حساب کاربری و سفارش‌ها
                </p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <button className="relative p-3 bg-white rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-300 group shadow-sm">
                  <FiBell className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
                  <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                <div className="flex items-center space-x-3 space-x-reverse bg-white rounded-2xl border border-gray-200 px-6 py-4 hover:bg-gray-50 transition-all duration-300 shadow-sm">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-medium shadow">
                    {user?.firstName?.[0] || "U"}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-gray-600 text-sm">سطح طلایی</p>
                  </div>
                  <FiChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Content */}
            {activeTab === "overview" && (
              <OverviewTab user={user} stats={stats} />
            )}
            {activeTab === "cart" && <CartTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "wishlist" && <WishlistTab />}
            {activeTab === "addresses" && <AddressesTab />}
            {activeTab === "payments" && <PaymentsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Overview Tab Component
function OverviewTab({ user, stats }) {
  const recentOrders = [
    {
      id: 1,
      orderNumber: "ORD-001",
      date: "۱۴۰۲/۱۰/۱۵",
      total: 1250000,
      status: "تحویل شده",
      items: 2,
      progress: 100,
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      date: "۱۴۰۲/۱۰/۱۰",
      total: 850000,
      status: "در حال ارسال",
      items: 1,
      progress: 75,
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 text-gray-900 border border-gray-200 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">
              سلام {user?.firstName} {user?.lastName}! 👋
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl">
              به پنل کاربری پیشرفته خوش آمدید. از اینجا می‌توانید تمام
              فعالیت‌های خود را به صورت هوشمند مدیریت کنید.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white rounded-2xl border border-gray-200 flex items-center justify-center shadow-sm">
              <FiZap className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "کل سفارش‌ها",
            value: stats.totalOrders,
            icon: FiShoppingBag,
            change: "+12%",
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label: "در انتظار",
            value: stats.pendingOrders,
            icon: FiClock,
            change: "-2%",
            gradient: "from-orange-500 to-red-500",
          },
          {
            label: "مبلغ کل",
            value: formatPrice(stats.totalSpent),
            icon: FiDollarSign,
            change: "+23%",
            gradient: "from-green-500 to-emerald-500",
          },
          {
            label: "سبد خرید",
            value: `${stats.cartItems} محصول`,
            icon: FiShoppingCart,
            change: "+5%",
            gradient: "from-purple-500 to-pink-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 group hover:scale-105 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform">
                  {stat.value}
                </p>
                <p className="text-green-500 text-xs mt-2 flex items-center">
                  <FiTrendingUp className="w-3 h-3 ml-1" />
                  {stat.change}
                </p>
              </div>
              <div
                className={`w-14 h-14 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                سفارش‌های اخیر
              </h3>
              <Link
                href="/user/orders"
                className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
              >
                مشاهده همه
                <FiChevronLeft className="w-4 h-4 mr-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPackage className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.date} • {order.items} کالا
                        </p>
                        <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(order.total)}
                      </p>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "تحویل شده"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-blue-100 text-blue-800 border border-blue-200"
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">هنوز سفارشی ثبت نکرده‌اید</p>
                <Link
                  href="/products"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  شروع خرید
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              دسترسی سریع
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: FiCart,
                  label: "سبد خرید",
                  href: "/user/dashboard?tab=cart",
                  color: "blue",
                },
                {
                  icon: FiUser,
                  label: "پروفایل",
                  href: "/user/profile",
                  color: "purple",
                },
                {
                  icon: FiMapPin,
                  label: "آدرس‌ها",
                  href: "/user/addresses",
                  color: "green",
                },
                {
                  icon: FiHeart,
                  label: "علاقه‌مندی‌ها",
                  href: "/user/dashboard?tab=wishlist",
                  color: "pink",
                },
              ].map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 bg-${action.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-${action.color}-200`}
                  >
                    <action.icon
                      className={`w-6 h-6 text-${action.color}-500`}
                    />
                  </div>
                  <span className="font-medium text-gray-900 text-sm text-center">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center border border-amber-200">
                <FiAward className="w-8 h-8 text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">سطح طلایی</h4>
                <p className="text-amber-600 text-sm mt-1">
                  شما در سطح طلایی هستید
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-amber-400 h-2 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-gray-600 text-xs mt-2">۷۵% تا سطح بعدی</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Cart Tab Component
function CartTab() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartSummary, setCartSummary] = useState({
    totalItems: 0,
    totalPrice: 0,
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cart");
      const result = await response.json();

      if (result.success) {
        setCartItems(result.cart?.items || []);
        setCartSummary({
          totalItems: result.cart?.totalItems || 0,
          totalPrice: result.cart?.totalPrice || 0,
        });
      } else {
        setError(result.error || "خطا در دریافت سبد خرید");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">سبد خرید من</h3>
        </div>
        <div className="p-6">
          <div className="flex justify-center items-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
            <span className="mr-2 text-gray-600">
              در حال بارگذاری سبد خرید...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">سبد خرید من</h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <FiShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCart}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">سبد خرید من</h3>
          <div className="text-right">
            <p className="text-gray-600 text-sm">
              تعداد کل: {cartSummary.totalItems} محصول
            </p>
            <p className="text-xl font-bold text-blue-500">
              {formatPrice(cartSummary.totalPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {cartItems.length > 0 ? (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                      {item.product?.images &&
                      item.product.images.length > 0 ? (
                        <img
                          src={`data:${
                            item.product.images[0].contentType
                          };base64,${Buffer.from(
                            item.product.images[0].data
                          ).toString("base64")}`}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <FiPackage className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                          {item.product?.title || "محصول بدون عنوان"}
                        </h4>

                        {/* Color and Size */}
                        <div className="flex flex-wrap gap-4 mb-3">
                          {item.color && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 text-sm">
                                رنگ:
                              </span>
                              <span className="text-gray-900 text-sm font-medium">
                                {item.color}
                              </span>
                            </div>
                          )}
                          {item.size && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600 text-sm">
                                سایز:
                              </span>
                              <span className="text-gray-900 text-sm font-medium">
                                {item.size}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-wrap items-center gap-6">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-600 text-sm">
                              تعداد:
                            </span>
                            <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                              <span className="px-4 py-2 border-x border-gray-200 min-w-12 text-center font-medium text-gray-900 bg-white">
                                {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-left">
                            <p className="text-lg font-bold text-blue-500">
                              {formatPrice(item.priceSnapshot * item.quantity)}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {formatPrice(item.priceSnapshot)} برای هر عدد
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Product Status */}
                      <div className="flex flex-col items-end gap-2">
                        {item.product?.status === "active" &&
                        item.product?.stock > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <FiCheckCircle className="w-4 h-4 ml-1" />
                            موجود
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                            ناموجود
                          </span>
                        )}

                        <Link
                          href={`/products/${item.product?.storeId}/${item.productId}`}
                          className="inline-flex items-center px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors font-medium"
                        >
                          <FiEye className="w-4 h-4 ml-1" />
                          مشاهده محصول
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="text-center lg:text-right">
                  <p className="text-xl font-semibold text-gray-900">
                    جمع کل: {formatPrice(cartSummary.totalPrice)}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {cartSummary.totalItems} محصول در سبد خرید
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/products"
                    className="px-8 py-4 border border-blue-500 text-blue-500 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-medium text-center transform hover:scale-105"
                  >
                    ادامه خرید
                  </Link>
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-medium transform hover:scale-105">
                    پرداخت و ثبت سفارش
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <FiShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">سبد خرید شما خالی است</p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              شروع خرید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Orders Tab Component
function OrdersTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = [
    {
      id: 1,
      orderNumber: "ORD-001",
      date: "۱۴۰۲/۱۰/۱۵",
      total: 1250000,
      status: "delivered",
      statusText: "تحویل شده",
      progress: 100,
      items: [
        {
          name: "کت چرم مردانه",
          price: 850000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
        {
          name: "کفش اسپرت",
          price: 400000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
      ],
    },
    {
      id: 2,
      orderNumber: "ORD-002",
      date: "۱۴۰۲/۱۰/۱۰",
      total: 850000,
      status: "shipping",
      statusText: "در حال ارسال",
      progress: 75,
      items: [
        {
          name: "مانتو تابستانه",
          price: 850000,
          quantity: 1,
          image: "/api/placeholder/80/80",
        },
      ],
    },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800 border-green-200",
      shipping: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || order.status === statusFilter)
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">سفارش‌های من</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="جستجوی سفارش..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full lg:w-64 pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="processing">در حال پردازش</option>
              <option value="shipping">در حال ارسال</option>
              <option value="delivered">تحویل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      سفارش #{order.orderNumber}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      تاریخ: {order.date}
                    </p>
                    <div className="w-48 bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <p className="font-semibold text-gray-900 text-lg">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.statusText}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                            <FiPackage className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              تعداد: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-end mt-6">
                  <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium transform hover:scale-105">
                    مشاهده جزئیات
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 font-medium transform hover:scale-105">
                    پیگیری سفارش
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">سفارشی یافت نشد</p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              شروع خرید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Wishlist Tab Component
function WishlistTab() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/wishlist");
      const result = await response.json();

      if (result.success) {
        setWishlistItems(result.wishlist?.items || []);
      } else {
        setError(result.error || "خطا در دریافت لیست علاقه‌مندی‌ها");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            لیست علاقه‌مندی‌ها
          </h3>
        </div>
        <div className="p-6">
          <div className="flex justify-center items-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
            <span className="mr-2 text-gray-600">در حال بارگذاری...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            لیست علاقه‌مندی‌ها
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <FiHeart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchWishlist}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            لیست علاقه‌مندی‌ها
          </h3>
          <span className="text-gray-600 text-sm">
            {wishlistItems.length} محصول
          </span>
        </div>
      </div>
      <div className="p-6">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 group hover:scale-105"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4 flex items-center justify-center border border-gray-200">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img
                        src={`data:${
                          item.product.images[0].contentType
                        };base64,${Buffer.from(
                          item.product.images[0].data
                        ).toString("base64")}`}
                        alt={item.product.title}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <FiPackage className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  {item.product?.comparePrice &&
                    item.product.comparePrice > item.product.price && (
                      <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow">
                        {Math.round(
                          (1 - item.product.price / item.product.comparePrice) *
                            100
                        )}
                        % تخفیف
                      </span>
                    )}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-300 shadow-sm">
                    <FiHeart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.product?.title || "محصول بدون عنوان"}
                </h4>

                <div className="flex items-center gap-2 mb-4">
                  <p className="text-lg font-bold text-blue-500">
                    {item.product?.price
                      ? formatPrice(item.product.price)
                      : "قیمت نامشخص"}
                  </p>
                  {item.product?.comparePrice &&
                    item.product.comparePrice > item.product.price && (
                      <p className="text-gray-500 text-sm line-through">
                        {formatPrice(item.product.comparePrice)}
                      </p>
                    )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/products/${item.product?.storeId}/${item.productId}`}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-2xl hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    <FiEye className="w-4 h-4" />
                    مشاهده محصول
                  </Link>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  اضافه شده در:{" "}
                  {new Date(item.addedAt).toLocaleDateString("fa-IR")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiHeart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              لیست علاقه‌مندی‌های شما خالی است
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
            >
              مشاهده محصولات
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Addresses Tab Component
function AddressesTab() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "منزل",
      fullName: "علی محمدی",
      phone: "09123456789",
      address: "تهران، خیابان ولیعصر، کوچه فلان، پلاک ۱۲۳",
      postalCode: "1234567890",
      isDefault: true,
      type: "home",
    },
    {
      id: 2,
      title: "محل کار",
      fullName: "علی محمدی",
      phone: "09123456789",
      address: "تهران، میدان ونک، برج فلان، طبقه ۵",
      postalCode: "1234567891",
      isDefault: false,
      type: "work",
    },
  ]);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">آدرس‌های من</h3>
        <button className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
          <FiPlus className="w-5 h-5 ml-2" />
          افزودن آدرس جدید
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 group hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      address.type === "home"
                        ? "bg-blue-100 text-blue-500 border border-blue-200"
                        : "bg-purple-100 text-purple-500 border border-purple-200"
                    }`}
                  >
                    {address.type === "home" ? (
                      <FiHome className="w-5 h-5" />
                    ) : (
                      <FiBriefcase className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {address.title}
                    </h4>
                    {address.isDefault && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full mt-1 border border-green-200">
                        آدرس پیش‌فرض
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">نام:</span>
                  <span>{address.fullName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">تلفن:</span>
                  <span>{address.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-medium text-gray-900">آدرس:</span>
                  <span className="flex-1">{address.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">کد پستی:</span>
                  <span>{address.postalCode}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Enhanced Payments Tab Component
function PaymentsTab() {
  const paymentMethods = [
    {
      id: 1,
      type: "کارت بانکی",
      number: "۶۲۱۹-۸۶۱۰-****-۱۲۳۴",
      bank: "ملی",
      isDefault: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">روش‌های پرداخت</h3>
        <button className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
          <FiPlus className="w-5 h-5 ml-2" />
          افزودن کارت جدید
        </button>
      </div>
      <div className="p-6">
        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-blue-300 transition-all duration-300 group hover:scale-105"
              >
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-14 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl shadow"></div>
                  <div>
                    <p className="font-semibold text-gray-900">{method.type}</p>
                    <p className="text-gray-600 text-sm">
                      {method.number} • بانک {method.bank}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  {method.isDefault && (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium border border-green-200">
                      پیش‌فرض
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiCreditCard className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              هیچ روش پرداختی اضافه نکرده‌اید
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium">
              افزودن کارت بانکی
            </button>
          </div>
        )}
      </div>
    </div>
  );
}