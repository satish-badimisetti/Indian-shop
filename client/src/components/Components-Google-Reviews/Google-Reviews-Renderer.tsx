const mockReviews = [
  {
    author_name: 'John Doe',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'Great service!',
    rating: 5,
  },
  {
    author_name: 'Jane Smith',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: ' Very satisfied. Very satisfied. Very satisfied. Very satisfied. Very satisfied. Very satisfied. Very satisfied. Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied. Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.Very satisfied.',
    rating: 4,
  },
  {
    author_name: 'Bob Johnson',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'Could be better.',
    rating: 3,
  },
  {
    author_name: 'Alice Williams',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'Not happy with the service.',
    rating: 2,
  },
  {
    author_name: 'Michael Brown',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'Excellent experience!',
    rating: 5,
  },
  {
    author_name: 'Emily Davis',
    profile_photo_url: 'https://via.placeholder.com/150',
    text: 'Okay, but room for improvement.',
    rating: 3,
  }
];

import React, { useEffect, useState } from 'react';
import { Card, CardContent, Avatar, Typography, IconButton, Grid, Box } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import axios from 'axios';

const PLACE_ID = 'YOUR_PLACE_ID';
const API_KEY = 'YOUR_API_KEY';

interface Review {
  author_name: string;
  profile_photo_url: string;
  text: string;
  rating: number;
}

const GoogleReviewsRenderer: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('https://serpapi.com/search', {
          params: {
            engine: 'google_maps_reviews',
            place_id: PLACE_ID,
            api_key: API_KEY,
          },
        });
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? 0 : prevIndex - 4));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 4 >= reviews.length ? prevIndex : prevIndex + 4));
  };

  return (
    <Box sx={{ textAlign: 'center', padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews.length === 0 ? (
        <Typography>No reviews available</Typography>
      ) : (
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton onClick={handlePrev} disabled={currentIndex === 0} sx={{ position: 'absolute', left: 0 }}>
            <ArrowBackIos />
          </IconButton>
          <Grid container spacing={2} justifyContent="flex-start" sx={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
            {reviews.slice(currentIndex, currentIndex + 4).map((review, index) => (
              <Grid item key={index} sx={{ flex: '0 0 auto', width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)', lg: 'calc(25% - 16px)' } }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar src={review.profile_photo_url} alt={review.author_name} />
                      <Box ml={2}>
                        <Typography variant="h6">{review.author_name}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" gutterBottom>
                      {review.text}
                    </Typography>
                    <Box mt="auto">
                      <Typography variant="body2">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          starIndex < review.rating
                            ? <span key={starIndex}>⭐</span>
                            : <span key={starIndex}>☆</span>
                        ))}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <IconButton onClick={handleNext} disabled={currentIndex + 4 >= reviews.length} sx={{ position: 'absolute', right: 0 }}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default GoogleReviewsRenderer;
