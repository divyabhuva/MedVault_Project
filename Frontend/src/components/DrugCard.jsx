const DrugCard = ({ drug }) => {
  const isLowStock =
    drug.stock_quantity <=
    drug.low_stock_threshold;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300">
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {drug.name}
          </h2>

          <p className="text-gray-500 mt-1">
            {drug.generic_name}
          </p>
        </div>

        {/* Status */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            isLowStock
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {isLowStock
            ? "Low Stock"
            : "Available"}
        </span>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">
            Category
          </span>

          <span className="text-gray-800">
            {drug.category}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">
            Unit
          </span>

          <span className="text-gray-800">
            {drug.unit_of_measure}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">
            Stock
          </span>

          <span
            className={`font-bold ${
              isLowStock
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {drug.stock_quantity}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">
            Threshold
          </span>

          <span className="text-gray-800">
            {drug.low_stock_threshold}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DrugCard;