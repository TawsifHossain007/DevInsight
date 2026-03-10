const DashboardSkeleton = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Title skeleton */}
      <div className="mb-8">
        <div className="skeleton h-10 w-64 mb-2"></div>
        <div className="skeleton h-5 w-96"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="skeleton h-4 w-24 mb-4"></div>
            <div className="skeleton h-8 w-16 mb-2"></div>
            <div className="skeleton h-3 w-32"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;