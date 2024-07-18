import { Navigate, createBrowserRouter } from "react-router-dom";
import AudioRecorder from "../pages/GoodMoodMix";


export const router = createBrowserRouter([
    {
        path: '/',
         element: <AudioRecorder/>
    },
    {
        path: '/login',
        // element: <LoginForm />
    },
    
    {
        path: '/',
        // element: <Layout />,
        // children: [
        
           
          
        // ]
    },


])
