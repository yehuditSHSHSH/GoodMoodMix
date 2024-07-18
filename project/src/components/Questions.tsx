import React from 'react';
import { Button, CircularProgress, Box, Typography, ListItem, List, ListItemText } from '@mui/material';

type QuestionsListProps = {
  questions: string[];
  onQuestionSelect: (question: string) => void;
};

const QuestionsList: React.FC<QuestionsListProps> = ({ questions, onQuestionSelect }) => {
  const handleQuestionClick = (question: string) => {
    onQuestionSelect(question);
  };


  return (
    <div>
      <Typography variant="h2" sx={{ mb: 4, fontWeight: 'bold', color: '#ffffff', textShadow: '2px 2px 4px #000000' }}>
        Questions:
      </Typography>
      <List>
        {questions.map((question, index) => (
          <ListItem
            key={index}
            button
            onClick={() => handleQuestionClick(question)}
            sx={{
              marginBottom: '10px',
              borderRadius: '8px',
              textTransform: 'none',
              width: '600px',
              backgroundColor: 'white',
              color: '#FF8080', 
              '&:hover': {
                backgroundColor: '#FF8080', 
                color: 'white', 
              }
            }}
         
            
          >
            <ListItemText
              primaryTypographyProps={{ variant: 'body1', color: 'textPrimary' }}
              primary={question} /></ListItem>
        ))}
      </List>
    </div>
  );
};
export default QuestionsList;
