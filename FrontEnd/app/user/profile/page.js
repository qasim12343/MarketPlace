// app/user/profile/page.js
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/fi";

export default function UserProfile() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    postCode: "",
    birthday: "",
    profileImage: "",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/user-session");
      const result = await response.json();

      if (!result.isAuthenticated || !result.user) {
        router.push("/user-login");
        return;
      }

      setUser(result.user);
      setFormData({
        firstName: result.user.firstName || "",
        lastName: result.user.lastName || "",
        email: result.user.email || "",
        phone: result.user.phone || "",
        city: result.user.city || "",
        postCode: result.user.postCode || "",
        birthday: result.user.birthday
          ? new Date(result.user.birthday).toISOString().split("T")[0]
          : "",
        profileImage: result.user.profileImage || "",
      });
    } catch (error) {
      console.error("Auth check error:", error);
      router.push("/user-login");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);

        // Show success feedback
        showNotification("پروفایل با موفقیت به روز شد", "success");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("خطا در به روزرسانی پروفایل", "error");
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
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      showNotification(
        "لطفاً یک تصویر معتبر انتخاب کنید (JPG, PNG, GIF)",
        "error"
      );
      return;
    }

    if (file.size > maxSize) {
      showNotification("حجم تصویر نباید بیشتر از ۵ مگابایت باشد", "error");
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = await fetch("/api/user/upload-profile-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData((prev) => ({ ...prev, profileImage: result.imageUrl }));
        showNotification("تصویر پروفایل با موفقیت آپلود شد", "success");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showNotification("خطا در آپلود تصویر", "error");
    } finally {
      setUploadingImage(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const showNotification = (message, type = "info") => {
    // You can replace this with a proper notification system like toast
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-transform duration-300 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
    }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 4000);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
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
                    className="flex items-center space-x-2 space-x-reverse px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    <FiX className="w-4 h-4" />
                    <span>انصراف</span>
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center space-x-2 space-x-reverse px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
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
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-purple-600">
                        {getInitials(formData.firstName, formData.lastName)}
                      </span>
                    )}

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
                    <div className="absolute -bottom-2 -right-2">
                      <button
                        onClick={triggerFileInput}
                        disabled={uploadingImage}
                        className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        <FiUpload className="w-4 h-4" />
                      </button>
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
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{formData.email}</p>
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
                  <span className="text-sm text-gray-600">عضو از</span>
                  <span className="text-sm text-gray-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                      : "---"}
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
                      نام
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="ml-2 w-4 h-4 text-gray-400" />
                      نام خانوادگی
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="09XXXXXXXXX"
                    />
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
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200"
                      placeholder="کد پستی ۱۰ رقمی"
                    />
                  </div>

                  {/* Birthday */}
                  <div className="space-y-2 md:col-span-2">
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
              </form>
            </div>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Security Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">امنیت</h4>
                <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200">
                  تغییر رمز عبور
                </button>
              </div>

              {/* Preferences Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">تنظیمات</h4>
                <button className="w-full text-center py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200">
                  تنظیمات اعلانات
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
