import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const StatsCard = ({ stats }) => {
  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Feedback Stats
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography>Total Feedback: {stats.total}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Positive: {stats.positive_percentage?.toFixed(2)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Negative: {stats.negative_percentage?.toFixed(2)}%</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Neutral: {stats.neutral_percentage?.toFixed(2)}%</Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" sx={{ mt: 2 }}>Language Breakdown</Typography>
        <ul>
          {stats.language_breakdown && Object.entries(stats.language_breakdown).map(([lang, count]) => (
            <li key={lang}>{lang}: {count}</li>
          ))}
        </ul>
        <Typography variant="h6" sx={{ mt: 2 }}>Product Breakdown</Typography>
        <ul>
          {stats.product_breakdown && Object.entries(stats.product_breakdown).map(([prod, count]) => (
            <li key={prod}>{prod}: {count}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
