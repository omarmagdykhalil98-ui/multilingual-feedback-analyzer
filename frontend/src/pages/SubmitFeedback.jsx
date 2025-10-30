
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
      if (error.response && error.response.status === 503) {
        toast.error('Server temporarily unavailable.', { id: toastId });
      } else {
        toast.error('Could not process text. Try again.', { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-background">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-secondary">Submit Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-secondary">
              Feedback
            </label>
            <div className="mt-1">
              <textarea
                id="feedback"
                name="feedback"
                rows={4}
                className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-200 rounded-md"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="product" className="block text-sm font-medium text-secondary">
              Product
            </label>
            <select
              id="product"
              name="product"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Select a product</option>
              <option value="prod-123">Product 123</option>
              <option value="prod-456">Product 456</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitFeedback;
