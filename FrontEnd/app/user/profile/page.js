// app/user/profile/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiSave,
  FiEdit,
  FiCamera,
  FiUpload,
  FiCheck,
  FiX,
  FiLock,
  FiBell,
  FiGlobe,
  FiShield,
} from "react-icons/fi";

const BASE_API = process.env.NEXT_PUBLIC_API_URL;

export default function UserProfile() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    city: "",
    post_code: "",
    birthday: "",
  });
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  };

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(`${BASE_API}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Not authenticated");
      }

      const userData = await response.json();
      console.log("User data:", userData);

      setUser(userData);
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        city: userData.city || "",
        post_code: userData.post_code || "",
        birthday: userData.birthday
          ? new Date(userData.birthday).toISOString().split("T")[0]
          : "",
      });

      // Set profile image preview if exists
      if (userData.profile_image || userData.profile_image_info) {
        const imageUrl = getImageUrl(
          userData.profile_image_info || userData.profile_image
        );
        setProfileImagePreview(imageUrl);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      toast.error("خطا در بارگذاری اطلاعات کاربر");
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageInfo) => {
    if (!imageInfo) return null;

    try {
      // If it's a blob URL (temporary preview)
      if (typeof imageInfo === "string" && imageInfo.startsWith("blob:")) {
        return imageInfo;
      }

      // If image URL is provided directly by Django
      if (imageInfo.url) {
        // Handle relative URLs
        if (imageInfo.url.startsWith("/")) {
          // For media URLs (like /media/profile_images/...), use Django base URL without /api
          if (imageInfo.url.startsWith("/media/")) {
            const djangoBaseUrl = BASE_API.replace("/api", "");
            return `${djangoBaseUrl}${imageInfo.url}`;
          }
          return `${BASE_API}${imageInfo.url}`;
        }
        return imageInfo.url;
      }

      if (imageInfo.filename) {
        return `${BASE_API}${imageInfo.filename}`;
      }

      if (typeof imageInfo === "string" && imageInfo.startsWith("http")) {
        return imageInfo;
      }

      return null;
    } catch (error) {
      console.error("❌ Error creating image URL:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("لطفا ابتدا وارد شوید");
        router.push("/auth/login");
        return;
      }

      // Prepare data for API
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        city: formData.city,
        post_code: formData.post_code,
        birthday: formData.birthday,
      };

      // Remove empty values
      Object.keys(updateData).forEach((key) => {
        if (
          updateData[key] === null ||
          updateData[key] === undefined ||
          updateData[key] === ""
        ) {
          delete updateData[key];
        }
      });

      const response = await fetch(`${BASE_API}/users/me/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      // Update user state
      setUser((prev) => ({
        ...prev,
        ...result,
      }));

      setIsEditing(false);
      toast.success("✅ پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "خطا در به‌روزرسانی پروفایل");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("لطفاً یک تصویر معتبر انتخاب کنید (JPG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > maxSize) {
      toast.error("حجم تصویر نباید بیشتر از ۵ مگابایت باشد");
      return;
    }

    // Create temporary preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfileImagePreview(previewUrl);

    setUploadingImage(true);

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("لطفا ابتدا وارد شوید");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${BASE_API}/users/me/upload-profile-image/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
      }

      const result = await response.json();

      // Update user state with new image data
      setUser((prev) => ({
        ...prev,
        profile_image_info: result.profile_image_info,
        has_profile_image: true,
      }));

      // Update preview with actual image URL
      const imageUrl = getImageUrl(result.profile_image_info);
      setProfileImagePreview(imageUrl);

      toast.success("✅ تصویر پروفایل با موفقیت آپلود شد");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(`خطا در آپلود تصویر: ${error.message}`);

      // Revert to previous image on error
      const oldUrl = user?.profile_image_info
        ? getImageUrl(user.profile_image_info)
        : null;
      setProfileImagePreview(oldUrl);
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeProfileImage = async () => {
    if (!confirm("آیا از حذف تصویر پروفایل اطمینان دارید؟")) {
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("لطفا ابتدا وارد شوید");
        return;
      }

      const response = await fetch(
        `${BASE_API}/users/me/remove-profile-image/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Delete failed");
      }

      const result = await response.json();

      // Update user state
      setUser((prev) => ({
        ...prev,
        profile_image_info: null,
        has_profile_image: false,
      }));

      setProfileImagePreview(null);
      toast.success("✅ تصویر پروفایل با موفقیت حذف شد");
    } catch (error) {
      console.error("Error removing profile image:", error);
      toast.error(`خطا در حذف تصویر: ${error.message}`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "ثبت نشده";
    try {
      return new Date(dateString).toLocaleDateString("fa-IR");
    } catch {
      return "نامعتبر";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری پروفایل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                پروفایل کاربری
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                مدیریت اطلاعات شخصی شما
              </p>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                  >
                    <FiX className="w-4 h-4" />
                    <span>انصراف</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiSave className="w-4 h-4" />
                    )}
                    <span>
                      {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FiEdit className="w-4 h-4" />
                  <span>ویرایش پروفایل</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sticky top-24">
              {/* Profile Image Section */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center relative overflow-hidden">
                    {profileImagePreview ? (
                      <img
                        src={profileImagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error("Profile image load error");
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full items-center justify-center ${
                        profileImagePreview ? "hidden" : "flex"
                      }`}
                    >
                      <span className="text-2xl font-bold text-purple-600">
                        {getInitials(formData.first_name, formData.last_name)}
                      </span>
                    </div>

                    {/* Upload Overlay */}
                    {isEditing && (
                      <div
                        onClick={triggerFileInput}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-200"
                      >
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        ) : (
                          <FiCamera className="w-6 h-6 text-white" />
                        )}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex justify-center gap-2 mt-4">
                      <button
                        onClick={triggerFileInput}
                        disabled={uploadingImage}
                        className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 text-sm disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <FiUpload className="w-3 h-3" />
                        )}
                        <span>تغییر عکس</span>
                      </button>

                      {profileImagePreview && (
                        <button
                          onClick={removeProfileImage}
                          className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 text-sm"
                        >
                          <FiX className="w-3 h-3" />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <h2 className="text-xl font-semibold text-gray-900 mt-4">
                  {formData.first_name} {formData.last_name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {formData.email || formData.phone}
                </p>

                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    عضویت:{" "}
                    {user?.date_joined ? formatDate(user.date_joined) : "---"}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">وضعیت حساب</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    فعال
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">شماره تماس</span>
                  <span className="text-sm text-gray-900">
                    {formData.phone || "ثبت نشده"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">شهر</span>
                  <span className="text-sm text-gray-900">
                    {formData.city || "ثبت نشده"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  اطلاعات شخصی
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  اطلاعات حساب کاربری و نحوه تماس با شما
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="ml-2 w-4 h-4 text-gray-400" />
                      نام *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="ml-2 w-4 h-4 text-gray-400" />
                      نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMail className="ml-2 w-4 h-4 text-gray-400" />
                      ایمیل
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiPhone className="ml-2 w-4 h-4 text-gray-400" />
                      شماره تماس
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        value={user?.phone || ""}
                        disabled
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                        placeholder="09XXXXXXXXX"
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        (غیرقابل تغییر)
                      </span>
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMapPin className="ml-2 w-4 h-4 text-gray-400" />
                      شهر
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="شهر خود را وارد کنید"
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMapPin className="ml-2 w-4 h-4 text-gray-400" />
                      کد پستی
                    </label>
                    <input
                      type="text"
                      name="post_code"
                      value={formData.post_code}
                      onChange={handleChange}
                      disabled={!isEditing}
                      maxLength="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="کد پستی ۱۰ رقمی"
                    />
                  </div>

                  {/* Birthday */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiCalendar className="ml-2 w-4 h-4 text-gray-400" />
                      تاریخ تولد
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        پس از ویرایش اطلاعات، دکمه ذخیره را بزنید
                      </p>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="flex items-center space-x-2 space-x-reverse px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>در حال ذخیره...</span>
                          </>
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            <span>ذخیره تغییرات</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Security Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FiLock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">امنیت حساب</h4>
                    <p className="text-gray-500 text-sm">
                      تغییر رمز عبور و احراز هویت
                    </p>
                  </div>
                </div>
                <button className="w-full text-center py-3 border-2 border-purple-500 text-purple-500 hover:bg-purple-50 rounded-xl transition-colors duration-200">
                  تغییر رمز عبور
                </button>
              </div>

              {/* Preferences Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiBell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      تنظیمات اعلانات
                    </h4>
                    <p className="text-gray-500 text-sm">
                      مدیریت اعلانات و اطلاع‌رسانی‌ها
                    </p>
                  </div>
                </div>
                <button className="w-full text-center py-3 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                  تنظیمات اعلانات
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 mt-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiShield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">اقدامات حساب</h4>
                  <p className="text-gray-500 text-sm">
                    مدیریت پیشرفته حساب کاربری
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  خروج از تمام دستگاه‌ها
                </button>
                <button className="py-3 px-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors duration-200">
                  غیرفعال کردن حساب
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
