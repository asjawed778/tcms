import { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

import image1 from '@/assets/images/image1.png';
import image2 from '../../assets/images/image2.png';
import image3 from '../../assets/images/image3.png';

const LoginVisuals = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <Box
      width="100%"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#e6f4ea"
      position="relative"
      px={2}
    >
      <Box
        maxWidth={500}
        width="100%"
        textAlign="center"
        position="relative"
      >
        <Box
          component="img"
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          sx={{
            width: '100%',
            maxHeight: { xs: 200, sm: 300, md: 350 },
            objectFit: 'contain',
            transition: 'all 0.5s ease-in-out',
            mb: 2,
          }}
        />

        <Typography variant="body1" color="text.secondary">
          Make your work easier and organized <br />
          with{' '}
          <Typography component="span" fontWeight="bold" color="primary">
            TCMS App
          </Typography>
        </Typography>

        {/* Dots */}
        <Box mt={3} display="flex" justifyContent="center" gap={1}>
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentIndex(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: index === currentIndex ? 'primary.main' : '#ccc',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>

        <IconButton
          onClick={prevSlide}
          sx={{
            position: 'absolute',
            top: '50%',
            left: -20,
            transform: 'translateY(-50%)',
            color: 'black',
            bgcolor: '',
            boxShadow: 1,
            '&:hover': { bgcolor: '#43a047', color: 'white' },
          }}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>

        <IconButton
          onClick={nextSlide}
          sx={{
            position: 'absolute',
            top: '50%',
            right: -20,
            transform: 'translateY(-50%)',
            color: 'black',
            bgcolor: '',
            boxShadow: 1,
            '&:hover': { bgcolor: '#43a047', color: 'white' },
          }}
        >
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
export default LoginVisuals;
