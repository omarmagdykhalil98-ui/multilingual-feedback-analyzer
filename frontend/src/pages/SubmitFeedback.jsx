import React, { useState } from 'react';
import { createFeedback } from '../services/api';
import toast from 'react-hot-toast';

const SubmitFeedback = ({ onFeedbackSubmitted }) => {
  const [text, setText] = useState('');
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Submitting feedback...');

    try {
      await createFeedback({ text, product_id: productId });
      setText('');
      setProductId('');
      onFeedbackSubmitted();
      toast.success('Feedback submitted successfully!', { id: toastId });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-dark-background min-h-screen transition-colors duration-300">
      <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Submit Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Field */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Feedback
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              required
              className="mt-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3
                         text-gray-800 dark:text-gray-100 bg-white dark:bg-dark-card
                         focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Product Dropdown */}
          <div>
            <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Product
            </label>
            <select
              id="product"
              name="product"
              className="mt-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3
                         text-gray-800 dark:text-gray-100 bg-white dark:bg-dark-card
                         focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select a product</option>
              <option value="prod-1">product 1</option>
              <option value="prod-2">product 2</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 font-semibold rounded-lg
                       text-white bg-gradient-to-r from-teal-500 to-emerald-500
                       hover:from-teal-600 hover:to-emerald-600 shadow-md hover:shadow-lg
                       transition-all duration-300 disabled:opacity-70"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0
                     c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitFeedback;
