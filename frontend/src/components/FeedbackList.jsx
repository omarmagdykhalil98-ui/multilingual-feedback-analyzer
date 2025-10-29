import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const FeedbackList = ({ feedback }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Feedback</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Language</TableCell>
            <TableCell>Sentiment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {feedback.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.original_text}</TableCell>
              <TableCell>{item.product_id}</TableCell>
              <TableCell>
                <Chip label={item.detected_language} size="small" />
              </TableCell>
              <TableCell>
                <Chip
                  label={item.sentiment}
                  size="small"
                  color={
                    item.sentiment === 'Positive'
                      ? 'success'
                      : item.sentiment === 'Negative'
                      ? 'error'
                      : 'default'
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FeedbackList;
