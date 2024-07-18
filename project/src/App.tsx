import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router'

function App() {


  return (
    <>
      <RouterProvider router={router} />
    </>
  );

}

export default App;
