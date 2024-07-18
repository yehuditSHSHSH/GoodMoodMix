import axios from '../utils/axios';

export const getData = async () => {
    const response = await axios.get('/data');
    const data = response.data;
    return response;
};

export const performHomeRequest = async () => {
    try {
        const response = await axios.get('/');
        console.log(response.data);  
        localStorage.setItem('installed', 'true');
    } catch (error) {
        console.error('Error performing home request:', error);
        throw error;
    }
};

export const fetchSongs = async (emotion: string, choice: string) => {
    const response = await axios.post('/get_songs', { emotion, choice }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  };

export const postData = async (formData: FormData) => {
    const response = await axios.post('/upload_audio', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response;
};

export const getSong = async (path:string) => {
    const response = await axios.get(`/get_audio?path=${encodeURIComponent(path)}`, {
        responseType: 'blob' 
    });
    console.log(response)
    return response
}


