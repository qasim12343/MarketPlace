"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  Star,
  Check,
  ShoppingBag,
  Loader2,
  Shield,
  Truck,
  RotateCcw,
  Clock,
  Share2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MapPin,
  Crown,
  Sparkles,
  X,
  User,
  LogIn,
  Store,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  Users,
  Package,
  Eye,
  Info,
} from "lucide-react";
import Loading from "@/components/ui/Loading";

// Color mapping for standard color names to HEX codes
const colorMap = {
  // Basic colors
  قرمز: "#FF0000",
  سرخ: "#FF0000",
  red: "#FF0000",
  آبی: "#0000FF",
  blue: "#0000FF",
  سبز: "#008000",
  green: "#008000",
  مشکی: "#000000",
  سیاه: "#000000",
  black: "#000000",
  سفید: "#FFFFFF",
  white: "#FFFFFF",
  زرد: "#FFFF00",
  yellow: "#FFFF00",
  نارنجی: "#FFA500",
  orange: "#FFA500",
  بنفش: "#800080",
  purple: "#800080",
  صورتی: "#FFC0CB",
  pink: "#FFC0CB",
  قهوه‌ای: "#A52A2A",
  brown: "#A52A2A",
  خاکستری: "#808080",
  gray: "#808080",
  grey: "#808080",

  // Additional common colors
  "نوک مدادی": "#36454F",
  نقره‌ای: "#C0C0C0",
  silver: "#C0C0C0",
  طلایی: "#FFD700",
  gold: "#FFD700",
  "نوک مدادی": "#2F4F4F",
  فیروزه‌ای: "#40E0D0",
  turquoise: "#40E0D0",
  لاجوردی: "#191970",
  navy: "#191970",
  زیتونی: "#808000",
  olive: "#808000",
  بژ: "#F5F5DC",
  beige: "#F5F5DC",
  عنابی: "#800000",
  maroon: "#800000",
  فسنجونی: "#FF00FF",
  magenta: "#FF00FF",
  "آبی آسمانی": "#87CEEB",
  skyblue: "#87CEEB",
  "سبز روشن": "#90EE90",
  lightgreen: "#90EE90",
};

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageZoom, setImageZoom] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authAction, setAuthAction] = useState(""); // "cart", "wishlist", or "ownerInfo"
  const [ownerStore, setOwnerStore] = useState(null);
  const [showOwnerInfo, setShowOwnerInfo] = useState(false);

  const storeOwnerId = params.id;
  const productId = params.slug;

  console.log("storeOwnerId: " + storeOwnerId);

  // Check user authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/user-session");
        const result = await response.json();

        if (result.isAuthenticated && result.user) {
          setUser(result.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  // Fetch owner store information
  useEffect(() => {
    const fetchOwnerStore = async () => {
      try {
        const response = await fetch(`/api/store-owners/${storeOwnerId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setOwnerStore(result.data);
          }
        }
      } catch (error) {
        console.error("Error fetching owner store:", error);
      }
    };

    if (storeOwnerId) {
      fetchOwnerStore();
    }
  }, [storeOwnerId]);

  // Function to get HEX color from color name
  const getColorHex = (colorName) => {
    if (!colorName) return "#CCCCCC";

    // If it's already a HEX code, return it
    if (colorName.startsWith("#")) {
      return colorName;
    }

    // Convert to lowercase and trim for matching
    const normalizedColor = colorName.trim().toLowerCase();

    // Find in color map
    for (const [key, value] of Object.entries(colorMap)) {
      if (key.toLowerCase() === normalizedColor) {
        return value;
      }
    }

    // If not found, generate a consistent color from the string
    return generateColorFromString(colorName);
  };

  // Function to generate a consistent color from string
  const generateColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8C471",
      "#82E0AA",
      "#F1948A",
      "#85C1E9",
      "#D7BDE2",
    ];

    return colors[Math.abs(hash) % colors.length];
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Product data:", result);

        if (result.success) {
          setProduct(result.data);
          // Set default selections
          if (result.data.colors && result.data.colors.length > 0) {
            setSelectedColor(result.data.colors[0]);
          }
          if (result.data.sizes && result.data.sizes.length > 0) {
            setSelectedSize(result.data.sizes[0]);
          }
        } else {
          setError(result.message || "خطا در دریافت اطلاعات محصول");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("خطا در دریافت اطلاعات محصول");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle add to cart with authentication check
  const handleAddToCart = async () => {
    // Validate selections
    if (!selectedColor && product.colors && product.colors.length > 0) {
      alert("لطفا رنگ محصول را انتخاب کنید");
      return;
    }

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert("لطفا سایز محصول را انتخاب کنید");
      return;
    }

    // Check if user is logged in
    if (!user) {
      setAuthAction("cart");
      setShowLoginModal(true);
      return;
    }

    // Proceed with adding to cart
    await addToCart();
  };

  // Actual add to cart function
  const addToCart = async () => {
    setAddingToCart(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
          color: selectedColor,
          size: selectedSize,
          ownerStoreId: storeOwnerId,
        }),
      });

      const result = await response.json();
      console.log("Add to cart response:", result);

      if (response.ok && result.success) {
        console.log("Product added to cart successfully");

        // Show success animation
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        // Trigger cart update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } else {
        console.error("Failed to add product to cart:", result.error);
        alert(result.error || "خطا در افزودن به سبد خرید");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle add to wishlist with authentication check
  const handleAddToWishlist = async () => {
    // Check if user is logged in
    if (!user) {
      setAuthAction("wishlist");
      setShowLoginModal(true);
      return;
    }

    // Proceed with adding to wishlist
    await addToWishlist();
  };

  // Actual add to wishlist function
  const addToWishlist = async () => {
    setAddingToWishlist(true);

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      const result = await response.json();
      console.log("Add to wishlist response:", result);

      if (response.ok && result.success) {
        console.log("Product added to wishlist successfully");

        // Show success feedback
        const wishlistBtn = document.getElementById("wishlist-btn");
        if (wishlistBtn) {
          wishlistBtn.classList.add("animate-pulse");
          setTimeout(() => wishlistBtn.classList.remove("animate-pulse"), 1000);
        }

        // Trigger wishlist update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
      } else {
        console.error("Failed to add product to wishlist:", result.error);
        alert(result.error || "خطا در افزودن به علاقه‌مندی‌ها");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert("خطا در ارتباط با سرور. لطفا دوباره تلاش کنید.");
    } finally {
      setAddingToWishlist(false);
    }
  };

  // Handle show owner info with authentication check
  const handleShowOwnerInfo = () => {
    // Check if user is logged in
    if (!user) {
      setAuthAction("ownerInfo");
      setShowLoginModal(true);
      return;
    }

    // Show owner info
    setShowOwnerInfo(true);
  };

  // Handle login modal actions
  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    if (!user) {
      // ذخیره مسیر فعلی و اطلاعات محصول
      const redirectData = {
        path: window.location.pathname,
        productId: product.id,
        timestamp: Date.now(),
      };
      localStorage.setItem("redirectAfterLogin", JSON.stringify(redirectData));
      router.push("/auth/user-login");
      return;
    }
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    setAuthAction("");
  };

  const nextImage = () => {
    if (product.images && product.images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 1) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Get modal message based on action
  const getModalMessage = () => {
    switch (authAction) {
      case "cart":
        return "برای افزودن محصول به سبد خرید";
      case "wishlist":
        return "برای افزودن محصول به علاقه‌مندی‌ها";
      case "ownerInfo":
        return "برای مشاهده اطلاعات کامل فروشنده";
      default:
        return "برای ادامه این عملیات";
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Loading
        text="در حال دریافت اطلاعات محصول..."
        subText="لطفا چند لحظه صبر کنید..."
        fullScreen={true}
      />
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">⚠️</div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            خطا در دریافت اطلاعات
          </h3>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            {error ||
              "محصول مورد نظر یافت نشد. ممکن است محصول حذف شده باشد یا آدرس وارد شده نادرست باشد."}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="bg-gray-600 text-white px-6 py-3 rounded-2xl hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 font-medium text-sm shadow-lg"
            >
              بازگشت
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium text-sm shadow-lg"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      ورود به حساب کاربری
                    </h3>
                    <p className="text-gray-600 text-sm">
                      برای ادامه نیاز به ورود دارید
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLoginCancel}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium text-sm mb-1">
                      {getModalMessage()}
                    </p>
                    <p className="text-blue-600 text-xs">
                      لطفا وارد حساب کاربری خود شوید
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Preview */}
              {(authAction === "cart" || authAction === "wishlist") && (
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    {product.images && product.images.length > 0 && (
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={`data:${
                            product.images[0].contentType
                          };base64,${Buffer.from(
                            product.images[0].data
                          ).toString("base64")}`}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {product.title}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2">
                        {product.shortDescription || "محصول انتخابی شما"}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-green-600 font-bold text-sm">
                          {product.price?.toLocaleString()} تومان
                        </span>
                        {selectedColor && (
                          <span className="text-gray-500 text-xs">
                            رنگ: {selectedColor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Store Preview for owner info */}
              {authAction === "ownerInfo" && ownerStore && (
                <div className="border border-gray-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {ownerStore.storeName}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2">
                        اطلاعات کامل فروشنده
                      </p>
                      <div className="flex items-center space-x-2">
                        <Star className="w-3 h-3 text-amber-500 fill-current" />
                        <span className="text-gray-500 text-xs">
                          فروشگاه معتبر
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleLoginCancel}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  لغو
                </button>
                <button
                  onClick={handleLoginConfirm}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>ورود به حساب</span>
                </button>
              </div>

              {/* Footer */}
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-xs">
                  حساب کاربری ندارید؟{" "}
                  <button
                    onClick={() => router.push("/auth/user-register")}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    ثبت نام کنید
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Owner Store Info Modal */}
      {showOwnerInfo && ownerStore && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xl">
                      اطلاعات فروشنده
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {ownerStore.storeName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOwnerInfo(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Store Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span>اطلاعات پایه</span>
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700 text-sm">
                        نام فروشگاه:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {ownerStore.storeName}
                      </span>
                    </div>

                    {ownerStore.sellerFirstName &&
                      ownerStore.sellerLastName && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-medium text-gray-700 text-sm">
                            نام مالک:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {ownerStore.sellerFirstName}{" "}
                            {ownerStore.sellerLastName}
                          </span>
                        </div>
                      )}

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700 text-sm">
                        نوع فروشگاه:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {ownerStore.storeType === "multi-vendor"
                          ? "چند فروشنده"
                          : "تک فروشنده"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <span className="font-medium text-gray-700 text-sm">
                        وضعیت:
                      </span>
                      <span
                        className={`font-semibold ${
                          ownerStore.sellerStatus === "approved"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {ownerStore.sellerStatus === "approved"
                          ? "تایید شده"
                          : "در انتظار تایید"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                    <Users className="w-5 h-5 text-green-500" />
                    <span>اطلاعات تماس</span>
                  </h4>

                  <div className="space-y-3">
                    {ownerStore.sellerPhone && (
                      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <Phone className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-blue-800 font-medium text-sm">
                            شماره تماس
                          </p>
                          <p className="text-blue-600 text-xs">
                            {ownerStore.sellerPhone}
                          </p>
                        </div>
                      </div>
                    )}

                    {ownerStore.sellerEmail && (
                      <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        <Mail className="w-4 h-4 text-green-500" />
                        <div>
                          <p className="text-green-800 font-medium text-sm">
                            ایمیل
                          </p>
                          <p className="text-green-600 text-xs">
                            {ownerStore.sellerEmail}
                          </p>
                        </div>
                      </div>
                    )}

                    {ownerStore.storeCity && (
                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-purple-800 font-medium text-sm">
                            موقعیت
                          </p>
                          <p className="text-purple-600 text-xs">
                            {/* {ownerStore.storeAddress} */}
                            {ownerStore.storeCity}
                          </p>
                        </div>
                      </div>
                    )}

                    {ownerStore.sellerJoinDate && (
                      <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="text-amber-800 font-medium text-sm">
                            عضویت از
                          </p>
                          <p className="text-amber-600 text-xs">
                            {new Date(
                              ownerStore.sellerJoinDate
                            ).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>اطلاعات تکمیلی</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 shadow-2xl border-2 border-white/20 animate-pulse">
                    <p className="text-white text-2xl font-bold text-center leading-relaxed drop-shadow-lg">
                      برای دونستن قیمت لطفا تماس بگیرید
                    </p>
                  </div>

                  {ownerStore.storeDescription && (
                    <div
                      className="col-span-1 md:col-span-3 bg-gray-100
                     rounded-xl p-4"
                    >
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {ownerStore.storeDescription}
                      </p>
                    </div>
                  )}

                  {ownerStore.sellerBio && (
                    <div className="col-span-1 md:col-span-3 bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-blue-800 text-sm font-medium mb-2">
                        درباره فروشنده:
                      </p>
                      <p className="text-blue-700 text-sm leading-relaxed">
                        {ownerStore.sellerBio}
                      </p>
                    </div>
                  )}

                  {ownerStore.sellerLicenseId && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                      <span className="font-medium text-green-700 text-sm">
                        پروانه کسب:
                      </span>
                      <span className="text-green-800 font-semibold text-sm">
                        {ownerStore.sellerLicenseId}
                      </span>
                    </div>
                  )}

                  {ownerStore.storePostalCode && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                      <span className="font-medium text-purple-700 text-sm">
                        کد پستی:
                      </span>
                      <span className="text-purple-800 font-semibold text-sm">
                        {ownerStore.storePostalCode}
                      </span>
                    </div>
                  )}

                  {ownerStore.storeAddress && (
                    <div className="col-span-1 md:col-span-3 flex items-start space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-amber-800 font-medium text-sm mb-1">
                          آدرس فروشگاه:
                        </p>
                        <p className="text-amber-700 text-sm">
                          {ownerStore.storeAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 text-lg mb-4 text-center">
                  آمار فروشگاه
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-700">۱۵+</p>
                    <p className="text-blue-600 text-xs">محصول فعال</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <Star className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-700">۴.۸</p>
                    <p className="text-green-600 text-xs">امتیاز فروشگاه</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-700">۵۰+</p>
                    <p className="text-purple-600 text-xs">مشتری راضی</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                    <Award className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-amber-700">۲</p>
                    <p className="text-amber-600 text-xs">سال سابقه</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-bold">✅ افزوده شد!</p>
              <p className="opacity-90">محصول به سبد خرید اضافه شد</p>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      {/* <div className="bg-white/80 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 flex items-center space-x-1"
            >
              <span>فروشگاه‌ها</span>
            </button>
            <ArrowRight className="h-3 w-3 rotate-180 text-gray-400" />
            <button
              onClick={() => router.push(`/stores/${storeOwnerId}`)}
              className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 flex items-center space-x-1"
            >
              <MapPin className="h-3 w-3" />
              <span>{product.storeName}</span>
            </button>
            <ArrowRight className="h-3 w-3 rotate-180 text-gray-400" />
            <span className="text-gray-900 font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-sm">
              {product.title}
            </span>
          </nav>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4 flex flex-col justify-start items-center">
              {/* Main Image with Zoom */}
              <div
                className="relative bg-gradient-to-br w-96 from-gray-100 to-gray-200 h-full lg:h-[450px] rounded-2xl overflow-hidden cursor-zoom-in group"
                onClick={() => setImageZoom(!imageZoom)}
              >
                {product.images && product.images.length > 0 ? (
                  <>
                    <img
                      src={`data:${
                        product.images[selectedImageIndex].contentType
                      };base64,${Buffer.from(
                        product.images[selectedImageIndex].data
                      ).toString("base64")}`}
                      alt={product.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageZoom ? "scale-200" : "group-hover:scale-105"
                      }`}
                    />

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all duration-300 hover:scale-110 group"
                        >
                          <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:bg-white transition-all duration-300 hover:scale-110 group"
                        >
                          <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-blue-600" />
                        </button>
                      </>
                    )}

                    {/* Zoom Indicator */}
                    <div className="absolute top-3 left-3 bg-black/50 text-white px-2 py-1 rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-1 text-xs">
                      <ZoomIn className="h-3 w-3" />
                      <span>برای زوم کلیک کنید</span>
                    </div>

                    {/* Discount Badge */}
                    {product.comparePrice &&
                      product.comparePrice > product.price && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-xl shadow-2xl font-bold text-xs">
                            {Math.round(
                              (1 - product.price / product.comparePrice) * 100
                            )}
                            % تخفیف
                          </div>
                        </div>
                      )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <ShoppingBag className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-1">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedImageIndex === index
                          ? "border-blue-500 shadow-lg scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`data:${image.contentType};base64,${Buffer.from(
                          image.data
                        ).toString("base64")}`}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                <Star className="h-4 w-4 text-amber-500 fill-current" />
                <span className="font-bold text-amber-700 text-sm">۴.۸</span>
                <span className="text-amber-600 text-xs">(۱۲ نظر)</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Product Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                      {product.title}
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                      {product.shortDescription ||
                        "محصولی با کیفیت عالی و طراحی مدرن"}
                    </p>
                  </div>
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 transform hover:scale-105">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Rating and Code */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 rounded-xl border border-amber-200">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="font-bold text-amber-700 text-sm">
                        {product.rating?.average
                          ? product.rating.average.toFixed(1)
                          : "5.0"}
                      </span>
                    </div>
                    {product.rating?.count && (
                      <span className="text-amber-600 text-xs">
                        ({product.rating.count} نظر)
                      </span>
                    )}
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-xl border border-blue-200 font-medium text-sm">
                    کد: {product.productCode || "1001"}
                  </div>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200/50">
                {/* بخش تماس برای قیمت - با طراحی جذاب برای جلب توجه */}
                <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-xl p-6 shadow-2xl border-2 border-white/30 animate-pulse mb-4">
                  <p className="text-white text-2xl font-bold text-center leading-relaxed drop-shadow-lg">
                    برای دونستن قیمت لطفا تماس بگیرید
                  </p>
                </div>

                {/* <div className="flex items-end justify-between mb-3">
    <div className="space-y-1">
      <span className="text-xl font-semibold text-gray-900">
        {product.price?.toLocaleString() || "650,000"} تومان
      </span>
      {product.comparePrice &&
        product.comparePrice > product.price && (
          <div className="space-y-1">
            <span className="text-base text-gray-500 line-through block">
              {product.comparePrice.toLocaleString()} تومان
            </span>
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold inline-block">
              صرفه‌جویی{" "}
              {Math.round(
                (1 - product.price / product.comparePrice) * 100
              )}
              %
            </div>
          </div>
        )}
    </div>
  </div> */}

                <div className="flex items-center space-x-3 text-sm">
                  <span
                    className={`flex items-center space-x-2 ${
                      product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        product.stock > 0 ? "bg-green-500" : "bg-red-500"
                      } animate-pulse`}
                    ></div>
                    <span className="font-medium">
                      {product.stock > 0
                        ? `موجود در انبار (${product.stock} عدد)`
                        : "ناموجود"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-base">
                      انتخاب رنگ
                    </h3>
                    {selectedColor && (
                      <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg text-sm">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`flex flex-col items-center space-y-2 transition-all duration-300 ${
                          selectedColor === color
                            ? "transform scale-105"
                            : "hover:scale-105"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl border-3 transition-all duration-300 shadow-lg ${
                            selectedColor === color
                              ? "border-blue-500 ring-3 ring-blue-200 shadow-xl"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                          style={{ backgroundColor: getColorHex(color) }}
                          title={color}
                        >
                          {selectedColor === color && (
                            <div className="w-full h-full flex items-center justify-center">
                              <Check className="h-5 w-5 text-white drop-shadow-lg" />
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-700 font-medium max-w-14 truncate">
                          {color}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-base">
                      انتخاب سایز
                    </h3>
                    {selectedSize && (
                      <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg text-sm">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 font-semibold transform hover:scale-105 text-sm ${
                          selectedSize === size
                            ? "border-blue-500 bg-blue-500 text-white shadow-xl scale-105"
                            : "border-gray-300 text-gray-700 hover:border-gray-400 bg-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-base">تعداد</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-xl bg-white shadow-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                    >
                      <span className="text-lg font-bold">−</span>
                    </button>
                    <span className="px-6 py-3 border-x border-gray-300 min-w-16 text-center font-bold text-base bg-gray-50">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-all duration-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={quantity >= product.stock}
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                  <span className="text-gray-600 font-medium text-sm">
                    حداکثر:{" "}
                    <span className="text-blue-600">{product.stock}</span> عدد
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-3">
                <button
                  onClick={handleShowOwnerInfo}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:shadow-lg transition-all duration-300 flex items-center space-x-2 group flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-base transition-all duration-300"
                >
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">مشاهده اطلاعات فروشنده</span>
                </button>

                {/* <button
                  onClick={handleAddToCart}
                  disabled={
                    product.stock === 0 ||
                    product.status !== "active" ||
                    addingToCart
                  }
                  className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 ${
                    product.stock > 0 &&
                    product.status === "active" &&
                    !addingToCart
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-lg"
                  }`}
                >
                  {addingToCart ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>در حال افزودن...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>
                        {product.stock > 0 && product.status === "active"
                          ? "افزودن به سبد خرید"
                          : "ناموجود"}
                      </span>
                    </>
                  )}
                </button> */}

                <button
                  id="wishlist-btn"
                  onClick={handleAddToWishlist}
                  disabled={addingToWishlist}
                  className={`p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    addingToWishlist
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {addingToWishlist ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Heart className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-xl border border-green-200 text-xs">
                  <Truck className="h-4 w-4" />
                  <span className="font-medium">ارسال رایگان</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200 text-xs">
                  <RotateCcw className="h-4 w-4" />
                  <span className="font-medium">بازگشت ۷ روزه</span>
                </div>
                <div className="flex items-center space-x-2 text-purple-600 bg-purple-50 px-3 py-2 rounded-xl border border-purple-200 text-xs">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">ضمانت اصل</span>
                </div>
                <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 text-xs">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">پشتیبانی ۲۴h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="border-t border-gray-200/50 p-8 bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  توضیحات کامل محصول
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              <div className="max-w-none">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
                  <p className="text-gray-700 leading-relaxed text-base mb-6 text-center">
                    {product.description ||
                      "این محصول با طراحی مدرن و کیفیت عالی، انتخاب مناسب برای استایل روزمره و مهمانی‌های شماست. استفاده از بهترین مواد و دوخت حرفه‌ای، راحتی و دوام را تضمین می‌کند."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        <span>مشخصات فنی</span>
                      </h3>
                      <ul className="space-y-3 text-gray-700 text-sm">
                        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-semibold text-gray-900 text-sm">
                            جنس:
                          </span>
                          <span className="bg-white px-3 py-1 rounded-lg border font-medium text-sm">
                            {product.material || "نخ پنبه با کیفیت"}
                          </span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-semibold text-gray-900 text-sm">
                            رنگ‌بندی:
                          </span>
                          <span className="bg-white px-3 py-1 rounded-lg border font-medium text-sm">
                            {product.colors
                              ? product.colors.join("، ")
                              : "متنوع"}
                          </span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-semibold text-gray-900 text-sm">
                            قابلیت شستشو:
                          </span>
                          <span className="bg-white px-3 py-1 rounded-lg border font-medium text-sm">
                            بدون افت کیفیت
                          </span>
                        </li>
                        <li className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <span className="font-semibold text-gray-900 text-sm">
                            مناسب فصل:
                          </span>
                          <span className="bg-white px-3 py-1 rounded-lg border font-medium text-sm">
                            بهار و تابستان
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        <span>ویژگی‌های خاص</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            ضمانت بازگشت ۷ روزه
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            ارسال رایگان برای خرید بالای ۲۰۰ هزار تومان
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            پشتیبانی ۲۴ ساعته
                          </span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            ارسال اکسپرس در تهران
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
