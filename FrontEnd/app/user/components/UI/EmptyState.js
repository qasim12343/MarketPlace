import Link from "next/link";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
}) {
  return (
    <div className="text-center py-12">
      <Icon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 mb-4">{title}</p>
      <p className="text-gray-400 text-sm mb-6">{description}</p>
      {buttonHref ? (
        <Link
          href={buttonHref}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
        >
          {buttonText}
        </Link>
      ) : (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
