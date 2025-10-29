
import React from 'react';

const FeedbackTable = ({ feedback }) => {

  const getSentimentClass = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-success text-white';
      case 'Negative':
        return 'bg-error text-white';
      default:
        return 'bg-neutral text-white';
    }
  };

  return (
    <div className="bg-card shadow-md rounded-lg">
        <div className="border-t border-gray-200">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Original Text</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Translated Text</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Product</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Language</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Sentiment</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="bg-card divide-y divide-gray-200">
                                {feedback.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{item.original_text}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{item.translated_text}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{item.product_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {item.detected_language}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSentimentClass(item.sentiment)}`}>
                                            {item.sentiment}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{new Date(item.created_at).toLocaleString()}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </div>
  )
}

export default FeedbackTable;
