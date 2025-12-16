import { FiTrendingUp } from "react-icons/fi";

export default function StatsCard({
  label,
  value,
  icon: Icon,
  change,
  gradient,
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 group hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-2xl font-bold text-gray-900 group-hover:scale-105 transition-transform">
            {value}
          </p>
          {change && (
            <p className="text-green-500 text-xs mt-2 flex items-center">
              <FiTrendingUp className="w-3 h-3 ml-1" />
              {change}
            </p>
          )}
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
