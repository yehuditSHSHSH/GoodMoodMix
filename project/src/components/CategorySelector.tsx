import React from 'react';
import { Button, CircularProgress, Box, Typography } from '@mui/material';
type Category = {
  name: string;
  questions: string[];
};

type CategorySelectorProps = {
  categories: Category[];
  onCategorySelect: (category: Category) => void;
};

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onCategorySelect }) => {
  const handleCategoryClick = (category: Category) => {
    onCategorySelect(category);
  };


  return (

    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#ffffff', textShadow: '2px 2px 4px #000000' }}>
        Select a category :
      </Typography>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {categories.map((category, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => onCategorySelect(category)}
              sx={{
                textTransform: 'none', width: '200px', backgroundColor: 'white', color: 'black', '&:hover': {
                  backgroundColor: '#ff8080',
                }
              }}

            >
              {category.name}
            </Button>
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default CategorySelector;

