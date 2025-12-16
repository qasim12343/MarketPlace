import Link from "next/link";
import {
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiHeart,
  FiShoppingBag,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
  FiPackage,
  FiAward,
  FiZap,
} from "react-icons/fi";
import StatsCard from "../UI/StatsCard";
import EmptyState from "../UI/EmptyState";

export default function OverviewTab({ user, stats }) {
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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">
              سلام {user?.firstName} {user?.lastName}! 👋
            </h2>
            <p className="text-blue-100 opacity-90 text-lg max-w-2xl">
              به پنل کاربری پیشرفته خوش آمدید. از اینجا می‌توانید تمام
              فعالیت‌های خود را به صورت هوشمند مدیریت کنید.
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <FiZap className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="کل سفارش‌ها"
          value={stats.totalOrders}
          icon={FiShoppingBag}
          change="+12%"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatsCard
          label="در انتظار"
          value={stats.pendingOrders}
          icon={FiClock}
          change="-2%"
          gradient="from-orange-500 to-red-500"
        />
        <StatsCard
          label="مبلغ کل"
          value={formatPrice(stats.totalSpent)}
          icon={FiDollarSign}
          change="+23%"
          gradient="from-green-500 to-emerald-500"
        />
        <StatsCard
          label="سبد خرید"
          value={`${stats.cartItems} محصول`}
          icon={FiShoppingCart}
          change="+5%"
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                سفارش‌های اخیر
              </h3>
              <Link
                href="/user/orders"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                مشاهده همه
                <FiTrendingUp className="w-4 h-4 mr-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-6">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiPackage className="w-6 h-6 text-blue-600" />
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
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
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
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FiShoppingCart}
                title="هنوز سفارشی ثبت نکرده‌اید"
                description="می‌توانید از فروشگاه ما دیدن کنید و اولین سفارش خود را ثبت نمایید"
                buttonText="شروع خرید"
                buttonHref="/products"
              />
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              دسترسی سریع
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: FiShoppingCart,
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
                  className="flex flex-col items-center p-6 border border-gray-200 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 bg-${action.color}-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-${action.color}-200`}
                  >
                    <action.icon
                      className={`w-6 h-6 text-${action.color}-600`}
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
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center border border-amber-200">
                <FiAward className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">سطح طلایی</h4>
                <p className="text-amber-600 text-sm mt-1">
                  شما در سطح طلایی هستید
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
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
