import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { createFeedback } from '../services/api';

const FeedbackForm = ({ onFeedbackSubmitted }) => {
  const [text, setText] = useState('');
  const [productId, setProductId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFeedback({ text, product_id: productId });
      setText('');
      setProductId('');
      onFeedbackSubmitted();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Feedback"
        value={text}
        onChange={(e) => setText(e.target.value)}
        multiline
        rows={4}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Product</InputLabel>
        <Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="prod-123">Product 123</MenuItem>
          <MenuItem value="prod-456">Product 456</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
      </Button>
    </form>
  );
};

export default FeedbackForm;
