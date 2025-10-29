import React from 'react';
import { AppBar, Toolbar, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const Header = ({ filters, onFilterChange }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Feedback Dashboard
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel>Product</InputLabel>
          <Select
            name="product_id"
            value={filters.product_id || ''}
            onChange={onFilterChange}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="prod-123">Product 123</MenuItem>
            <MenuItem value="prod-456">Product 456</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel>Language</InputLabel>
          <Select
            name="language"
            value={filters.language || ''}
            onChange={onFilterChange}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            {/* Add more languages as needed */}
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel>Sentiment</InputLabel>
          <Select
            name="sentiment"
            value={filters.sentiment || ''}
            onChange={onFilterChange}
          >
            <MenuItem value=""><em>All</em></MenuItem>
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Negative">Negative</MenuItem>
            <MenuItem value="Neutral">Neutral</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
