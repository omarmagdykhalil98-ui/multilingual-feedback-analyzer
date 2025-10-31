import React from "react";

const FeedbackTable = ({
  feedback,
  stats,
  searchTerm,
  setSearchTerm,
  productFilter,
  setProductFilter,
  languageFilter,
  setLanguageFilter,
  sentimentFilter,
  setSentimentFilter,
}) => {
  const productData = Object.entries(stats?.product_breakdown || {}).map(
    ([name, value]) => ({ name, value })
  );

  const getSentimentClass = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return "bg-green-500 text-white";
      case "Negative":
        return "bg-red-500 text-white";
      case "Neutral":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };
  return (
    <div className="bg-white dark:bg-dark-card shadow-md rounded-xl transition-all duration-300">
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-dark-surface">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Original Text
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Translated Text
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Language
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Sentiment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Timestamp
                    </th>
                  </tr>
                  <tr>
                    <th className="px-6 py-3">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </th>
                    <th className="px-6 py-3"></th> {/* Translated Text - No filter for now */}
                    <th className="px-6 py-3">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 w-full"
                        value={productFilter}
                        onChange={(e) => setProductFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        {productData.map((p) => (
                          <option key={p.name} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th className="px-6 py-3">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 w-full"
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        {Object.keys(stats?.language_breakdown || {}).map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th className="px-6 py-3">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 w-full"
                        value={sentimentFilter}
                        onChange={(e) => setSentimentFilter(e.target.value)}
                      >
                        <option value="">All</option>
                        {["Positive", "Negative", "Neutral"].map((sentiment) => (
                          <option key={sentiment} value={sentiment}>
                            {sentiment}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th className="px-6 py-3"></th> {/* Timestamp - No filter for now */}
                  </tr>
                </thead>

                <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                  {feedback && feedback.length > 0 ? (
                    feedback.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                      >
                        {/* Original Text (backend field: text) */}
                        <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                          {item.original_text || item.text || "(No text provided)"}
                        </td>

                        {/* Translated Text */}
                        <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                          {item.translated_text || "-"}
                        </td>

                        {/* Product */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.product_id || "-"}
                        </td>

                        {/* Language */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {item.detected_language || "-"}
                          </span>
                        </td>

                        {/* Sentiment */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSentimentClass(
                              item.sentiment
                            )}`}
                          >
                            {item.sentiment || "Unknown"}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-6 text-gray-500 dark:text-gray-400"
                      >
                        No feedback data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackTable;
