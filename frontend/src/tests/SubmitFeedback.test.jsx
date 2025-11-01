import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SubmitFeedback from '../pages/SubmitFeedback';
import * as api from '../services/api';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../services/api', () => ({
  createFeedback: vi.fn(),
}));

describe('SubmitFeedback Component', () => {
  it('renders the form correctly', () => {
    render(<SubmitFeedback onFeedbackSubmitted={() => {}} />);
    expect(screen.getByRole('heading', { name: /submit feedback/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Feedback')).toBeInTheDocument();
    expect(screen.getByLabelText('Product')).toBeInTheDocument();
  });

  it('submits feedback successfully', async () => {
    api.createFeedback.mockResolvedValueOnce({});

    render(<SubmitFeedback onFeedbackSubmitted={() => {}} />);

    fireEvent.change(screen.getByLabelText('Feedback'), {
      target: { value: 'Great product!' },
    });
    fireEvent.change(screen.getByLabelText('Product'), {
      target: { value: 'prod-123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));

    await waitFor(() =>
      expect(api.createFeedback).toHaveBeenCalledWith({
        text: 'Great product!',
        product_id: 'prod-123',
      })
    );
  });
});
