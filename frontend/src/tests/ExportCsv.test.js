import Papa from 'papaparse';
import { describe, it, expect, vi } from 'vitest';

describe('Export CSV Function', () => {
  it('generates valid CSV with correct fields', () => {
    const mockFeedback = [
      {
        id: 1,
        product_id: 'prod-1',
        text: 'Great product',
        translated_text: 'Super produit',
        detected_language: 'en',
        sentiment: 'Positive',
        created_at: '2025-10-31T12:00:00Z',
      },
    ];

    const filteredFeedback = mockFeedback;
    const unparseSpy = vi.spyOn(Papa, 'unparse');

    // Import your function here or paste directly
    const exportToCsv = () => {
      const filteredData = filteredFeedback.map(
        ({ id, product_id, text, translated_text, detected_language, sentiment, created_at }) => ({
          ID: id,
          'Product ID': product_id,
          'Original Text': text,
          'Translated Text': translated_text,
          'Detected Language': detected_language,
          Sentiment: sentiment,
          'Created At': new Date(created_at).toLocaleString(),
        })
      );
      Papa.unparse(filteredData);
    };

    exportToCsv();

    expect(unparseSpy).toHaveBeenCalled();
    const [arg] = unparseSpy.mock.calls[0];
    expect(arg[0]).toMatchObject({
      ID: 1,
      'Product ID': 'prod-1',
      'Original Text': 'Great product',
    });
  });
});
