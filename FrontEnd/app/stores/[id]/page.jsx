"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Store,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Package,
  Shield,
  Truck,
  Clock,
  Heart,
  Share2,
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingCart,
  Award,
  CheckCircle,
  TrendingUp,
  Home,
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

const StoreDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id;

  const [storeDetails, setStoreDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [isFavorite, setIsFavorite] = useState(false);

  // Extract store info from products or create default store details
  const extractStoreInfoFromProducts = useCallback((productsList) => {
    if (productsList.length === 0) return null;
    
    // Get first product to extract store info
    const firstProduct = productsList[0];
    const storeOwner = firstProduct.store_owner;
    
    if (!storeOwner) return null;
    
    return {
      id: storeOwner.id,
      store_name: storeOwner.store_name || "فروشگاه ناشناس",
      store_logo: storeOwner.store_logo || null,
      city: storeOwner.city || "نامشخص",
      phone: storeOwner.phone || "ثبت نشده",
      email: storeOwner.email || "ثبت نشده",
      first_name: storeOwner.first_name || "",
      last_name: storeOwner.last_name || "",
      store_rating: {
        average: storeOwner.store_rating?.average || 0,
        count: storeOwner.store_rating?.count || 0
      },
      created_at: storeOwner.created_at || new Date().toISOString(),
      products_count: productsList.length,
    };
  }, []);

  // Fetch store products and extract store info from them
  const fetchStoreData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get products from all categories
      const categories = ["men", "women", "kids"];
      let allProducts = [];
      
      // Try each category endpoint
      for (const category of categories) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/categories/${category}/stores/${storeId}/products/`
          );
          
          if (response.ok) {
            const productsData = await response.json();
            if (Array.isArray(productsData)) {
              // Add category to each product
              const productsWithCategory = productsData.map(product => ({
                ...product,
                category: category
              }));
              allProducts = [...allProducts, ...productsWithCategory];
            }
          }
        } catch (error) {
          console.log(`No products found for category ${category}:`, error.message);
        }
      }

      // If no products found via category endpoints, try general products endpoint
      if (allProducts.length === 0) {
        try {
          const response = await fetch(`${API_BASE_URL}/products/`);
          if (response.ok) {
            const allProductsData = await response.json();
            // Filter products by store owner ID
            const storeProducts = Array.isArray(allProductsData) 
              ? allProductsData.filter(product => {
                  const productStoreId = product.store_owner?.id || product.store_owner?._id;
                  return productStoreId === storeId;
                })
              : [];
            allProducts = storeProducts;
          }
        } catch (error) {
          console.log("Error fetching all products:", error);
        }
      }

      console.log(`Found ${allProducts.length} products for store ${storeId}`, allProducts);

      // Extract store info from products
      const storeInfo = extractStoreInfoFromProducts(allProducts);
      
      if (!storeInfo) {
        // If no store info found, create a default store
        setStoreDetails({
          id: storeId,
          store_name: "فروشگاه",
          store_logo: null,
          city: "نامشخص",
          phone: "ثبت نشده",
          email: "ثبت نشده",
          first_name: "فروشنده",
          last_name: "",
          store_rating: {
            average: 0,
            count: 0
          },
          created_at: new Date().toISOString(),
          products_count: allProducts.length,
        });
      } else {
        setStoreDetails(storeInfo);
      }

      setProducts(allProducts);
      setFilteredProducts(allProducts);
      
    } catch (error) {
      console.error("Error fetching store data:", error);
      setError("خطا در دریافت اطلاعات فروشگاه");
    } finally {
      setLoading(false);
    }
  }, [storeId, extractStoreInfoFromProducts]);

  // Fetch all data on component mount
  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId, fetchStoreData]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0)
        );
        break;
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, sortBy, selectedCategory]);

  // Get current products for pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get unique categories from products
  const categories = [
    "all",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
        .filter((category) => category && category !== "")
    ),
  ];

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    alert(`محصول ${product.title} به سبد خرید اضافه شد`);
  };

  const handleViewProduct = (productId) => {
    router.push(`/product/${productId}`);
  };

  const handleShareStore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storeDetails?.store_name || "فروشگاه",
          text: "این فروشگاه را مشاهده کنید",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("لینک فروشگاه کپی شد!");
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Function to get product image URL
  const getProductImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const image = product.images[0];
      if (image.url) {
        return image.url;
      } else if (image.image) {
        return image.image;
      } else if (typeof image === 'string') {
        return image;
      }
    }
    
    if (product.image) {
      if (typeof product.image === 'string') {
        return product.image;
      } else if (product.image.url) {
        return product.image.url;
      }
    }
    
    return null;
  };

  // Function to get full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/media/')) {
      return `http://127.0.0.1:8000${imagePath}`;
    }
    return imagePath;
  };

  // Handle retry
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    fetchStoreData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            در حال دریافت اطلاعات فروشگاه...
          </p>
        </div>
      </div>
    );
  }

  if (error || !storeDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-20 w-20 text-red-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "فروشگاه یافت نشد"}
          </h3>
          <p className="text-gray-600 mb-6">
            متاسفانه نتوانستیم اطلاعات این فروشگاه را پیدا کنیم.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              صفحه اصلی
            </button>
            <button
              onClick={handleRetry}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Store Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-6 flex-1">
                {/* Store Logo */}
                <div className="relative">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white overflow-hidden">
                    {storeDetails.store_logo ? (
                      <img
                        src={getFullImageUrl(storeDetails.store_logo)}
                        alt={storeDetails.store_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.classList.remove('bg-gradient-to-br', 'from-blue-500', 'to-purple-600');
                          e.target.parentElement.classList.add('bg-gradient-to-br', 'from-gray-400', 'to-gray-600');
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Store className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </div>

                {/* Store Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {storeDetails.store_name}
                    </h1>
                    <button
                      onClick={handleToggleFavorite}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isFavorite
                          ? "bg-red-50 text-red-500"
                          : "bg-gray-100 text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                    {products.length > 0 
                      ? `فروشگاه تخصصی با ${products.length} محصول با کیفیت` 
                      : "فروشگاه تخصصی با خدمات عالی"}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 ml-1" />
                      {storeDetails.store_rating?.average > 0
                        ? storeDetails.store_rating.average.toFixed(1)
                        : "جدید"}
                      {storeDetails.store_rating?.count > 0 &&
                        ` (${storeDetails.store_rating.count} نظر)`}
                    </span>
                    <span className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <Package className="h-4 w-4 ml-1" />
                      {products.length} محصول
                    </span>
                    {storeDetails.city && (
                      <span className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                        <MapPin className="h-4 w-4 ml-1" />
                        {storeDetails.city}
                      </span>
                    )}
                    <span className="flex items-center bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                      <Truck className="h-4 w-4 ml-1" />
                      ارسال 24-48 ساعته
                    </span>
                  </div>
                </div>
              </div>

              {/* Seller Info & Actions */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">
                      {storeDetails.first_name} {storeDetails.last_name}
                    </p>
                    <p className="text-gray-600 text-sm">فروشنده</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-500">
                        {storeDetails.store_rating?.average?.toFixed(1) ||
                          "جدید"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleShareStore}
                    className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    اشتراک گذاری
                  </button>
                  {storeDetails.phone && storeDetails.phone !== "ثبت نشده" && (
                    <a
                      href={`tel:${storeDetails.phone}`}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      تماس
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-1 mb-8 border border-gray-200">
          <nav className="flex space-x-1 rtl:space-x-reverse overflow-x-auto">
            {[
              { id: "products", label: "محصولات", count: products.length },
              { id: "info", label: "اطلاعات فروشگاه" },
              { id: "seller", label: "اطلاعات فروشنده" },
              {
                id: "reviews",
                label: "نظرات",
                count: storeDetails.store_rating?.count || 0,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? "bg-white text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Products Header with Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="جستجو در محصولات فروشگاه..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  {/* View Mode */}
                  <div className="flex bg-gray-100 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-32"
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="oldest">قدیمی ترین</option>
                    <option value="price-low">قیمت: کم به زیاد</option>
                    <option value="price-high">قیمت: زیاد به کم</option>
                  </select>

                  {/* Category Filter */}
                  {categories.length > 1 && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-32"
                    >
                      <option value="all">همه دسته بندی ها</option>
                      {categories
                        .filter((cat) => cat !== "all")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category === "men" ? "مردانه" : 
                             category === "women" ? "زنانه" : 
                             category === "kids" ? "کودک" : category}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Results Info */}
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <span>
                  نمایش {Math.min(currentProducts.length, filteredProducts.length)} از {filteredProducts.length}{" "}
                  محصول
                  {searchTerm && ` برای "${searchTerm}"`}
                </span>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    حذف فیلتر
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid/List */}
            {currentProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {currentProducts.map((product) => {
                    const imageUrl = getProductImageUrl(product);
                    const fullImageUrl = getFullImageUrl(imageUrl);
                    const isAvailable = product.stock > 0;

                    return (
                      <div
                        key={product.id}
                        className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl group ${
                          viewMode === "list" ? "flex" : ""
                        }`}
                      >
                        {/* Product Image */}
                        <div
                          className={`relative cursor-pointer ${
                            viewMode === "list" ? "w-48 flex-shrink-0" : ""
                          } aspect-square bg-gray-100`}
                          onClick={() => handleViewProduct(product.id)}
                        >
                          {fullImageUrl ? (
                            <img
                              src={fullImageUrl}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                              <ShoppingBag className="h-12 w-12 text-gray-400" />
                            </div>
                          )}

                          {/* Discount Badge */}
                          {product.compare_price && product.compare_price > product.price && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              {Math.round(
                                (1 - product.price / product.compare_price) * 100
                              )}
                              %
                            </div>
                          )}

                          {/* Status Badge */}
                          {!isAvailable && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                ناموجود
                              </span>
                            </div>
                          )}

                          {/* Quick View Button */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProduct(product.id);
                              }}
                              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 transition-all duration-200 flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              مشاهده سریع
                            </button>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div
                          className={`p-4 flex-1 flex flex-col ${
                            viewMode === "list" ? "justify-between" : ""
                          }`}
                        >
                          <div>
                            <h3
                              className="font-semibold text-gray-900 line-clamp-2 text-sm mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => handleViewProduct(product.id)}
                            >
                              {product.title}
                            </h3>

                            {product.description && (
                              <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                                {product.description}
                              </p>
                            )}

                            {product.category && (
                              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-3">
                                {product.category === "men" ? "مردانه" : 
                                 product.category === "women" ? "زنانه" : 
                                 product.category === "kids" ? "کودک" : product.category}
                              </span>
                            )}

                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-900">
                                  {product.price?.toLocaleString() || "۰"} تومان
                                </span>
                                {product.compare_price && product.compare_price > product.price && (
                                  <span className="text-sm text-gray-500 line-through">
                                    {product.compare_price?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {product.stock > 0 && product.stock <= 10 && (
                                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                  فقط {product.stock} عدد باقی مانده
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewProduct(product.id)}
                              className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-sm flex items-center justify-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              مشاهده
                            </button>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!isAvailable}
                              className={`flex-1 py-2 px-3 rounded-xl transition-all duration-200 font-medium text-sm flex items-center justify-center gap-1 ${
                                isAvailable
                                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <ShoppingCart className="h-4 w-4" />
                              {isAvailable ? "خرید" : "ناموجود"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === index + 1
                            ? "bg-blue-600 text-white shadow-lg"
                            : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <ShoppingBag className="h-20 w-20 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  محصولی یافت نشد
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? `نتیجه‌ای برای جستجوی شما پیدا نشد. می‌توانید با تغییر فیلترها دوباره جستجو کنید.`
                    : "هنوز محصولی در این فروشگاه ثبت نشده است."}
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    مشاهده همه محصولات
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Store Information Tab */}
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Information */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-600" />
                اطلاعات فروشگاه
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "نام فروشگاه",
                    value: storeDetails.store_name,
                    icon: Store,
                  },
                  {
                    label: "شهر",
                    value: storeDetails.city || "ثبت نشده",
                    icon: MapPin,
                  },
                  {
                    label: "تلفن",
                    value: storeDetails.phone,
                    icon: Phone,
                  },
                  {
                    label: "ایمیل",
                    value: storeDetails.email,
                    icon: Mail,
                  },
                  {
                    label: "امتیاز فروشگاه",
                    value: `${storeDetails.store_rating?.average?.toFixed(1) || "۰"} (${storeDetails.store_rating?.count || "۰"} نظر)`,
                    icon: Star,
                  },
                  {
                    label: "تعداد محصولات",
                    value: products.length,
                    icon: Package,
                  },
                  {
                    label: "تاریخ عضویت",
                    value: storeDetails.created_at 
                      ? new Date(storeDetails.created_at).toLocaleDateString('fa-IR')
                      : "ثبت نشده",
                    icon: Calendar,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-600 flex items-center gap-2">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}:
                    </span>
                    <span className="font-medium text-left max-w-xs text-gray-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Store Features */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                امکانات فروشگاه
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: Shield,
                    label: "تضمین اصالت کالا",
                    color: "bg-green-100 text-green-600",
                    description: "کلیه محصولات دارای اصالت و گارانتی می‌باشند",
                  },
                  {
                    icon: Truck,
                    label: "ارسال به سراسر کشور",
                    color: "bg-blue-100 text-blue-600",
                    description: "ارسال سریع به تمام نقاط ایران",
                  },
                  {
                    icon: Clock,
                    label: "پشتیبانی 24 ساعته",
                    color: "bg-purple-100 text-purple-600",
                    description: "پشتیبانی آنلاین در تمام ساعات",
                  },
                  {
                    icon: Award,
                    label: "کیفیت عالی",
                    color: "bg-orange-100 text-orange-600",
                    description: "محصولات با کیفیت بالا و تضمین شده",
                  },
                  {
                    icon: TrendingUp,
                    label: "رضایت مشتری",
                    color: "bg-yellow-100 text-yellow-600",
                    description: `رضایت ${storeDetails.store_rating?.average ? (storeDetails.store_rating.average * 20).toFixed(0) : "۱۰۰"}% از مشتریان`,
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`p-2 rounded-lg ${feature.color} flex-shrink-0`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 block mb-1">
                        {feature.label}
                      </span>
                      <span className="text-sm text-gray-600">
                        {feature.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Seller Information Tab */}
        {activeTab === "seller" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              اطلاعات فروشنده
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  اطلاعات شخصی
                </h4>
                {[
                  {
                    label: "نام کامل",
                    value: `${storeDetails.first_name} ${storeDetails.last_name}`,
                    icon: User,
                  },
                  {
                    label: "تلفن همراه",
                    value: storeDetails.phone,
                    icon: Phone,
                  },
                  ...(storeDetails.email
                    ? [
                        {
                          label: "ایمیل",
                          value: storeDetails.email,
                          icon: Mail,
                        },
                      ]
                    : []),
                  {
                    label: "شهر",
                    value: storeDetails.city || "ثبت نشده",
                    icon: MapPin,
                  },
                  {
                    label: "تاریخ عضویت",
                    value: storeDetails.created_at 
                      ? new Date(storeDetails.created_at).toLocaleDateString('fa-IR')
                      : "ثبت نشده",
                    icon: Calendar,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100"
                  >
                    <span className="text-gray-600 flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}:
                    </span>
                    <span className="font-medium text-gray-900 max-w-xs text-left">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 border-b pb-2">
                  اطلاعات فروشگاه
                </h4>
                {[
                  {
                    label: "نام فروشگاه",
                    value: storeDetails.store_name,
                    icon: Store,
                  },
                  {
                    label: "امتیاز فروشگاه",
                    value: `${storeDetails.store_rating?.average?.toFixed(1) || "۰"} (${storeDetails.store_rating?.count || "۰"} نظر)`,
                    icon: Star,
                  },
                  {
                    label: "تعداد محصولات",
                    value: products.length,
                    icon: Package,
                  },
                  {
                    label: "وضعیت فروشگاه",
                    value: "فعال",
                    icon: CheckCircle,
                    color: "text-green-600",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start py-3 border-b border-gray-100"
                  >
                    <span className="text-gray-600 flex items-center gap-2 flex-shrink-0">
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}:
                    </span>
                    <span className={`font-medium text-left max-w-xs ${item.color || "text-gray-900"}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              نظرات مشتریان
            </h3>

            {storeDetails.store_rating?.count > 0 ? (
              <div className="space-y-6">
                {/* Rating Summary */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">
                        {storeDetails.store_rating.average.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(storeDetails.store_rating.average)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {storeDetails.store_rating.count} نظر
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = 0; // You would get this from your API
                        const percentage = count > 0 ? (count / storeDetails.store_rating.count) * 100 : 0;

                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 w-4">
                              {star}
                            </span>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12">
                              {count} نظر
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  <p className="text-gray-600 text-center py-8">
                    سیستم نمایش نظرات به زودی راه‌اندازی خواهد شد.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  هنوز نظری ثبت نشده است
                </h4>
                <p className="text-gray-600">
                  اولین نفری باشید که برای این فروشگاه نظر می‌دهد.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetailPage;