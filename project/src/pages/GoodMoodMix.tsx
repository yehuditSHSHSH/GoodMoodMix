// import React, { useState, useRef, useEffect } from 'react';
// import { Box, Button, CircularProgress, Typography } from '@mui/material';
// import { postData, getSong, performHomeRequest, fetchSongs } from '../services/ser.service';
// import CategorySelector from '../components/CategorySelector';
// import QuestionsList from '../components/Questions';
// import ConfirmDialog from '../components/ConfirmDialog'; // ייבוא הקומפוננטה החדשה
// import { PlayArrow } from '@mui/icons-material';

// type Category = {
//   name: string;
//   questions: string[];
// };

// const categories: Category[] = [
//   {
//     name: "Weather",
//     questions: [
//       "Are you satisfied with the weather in your place today?",
//       "What season of the year do you like the most, and why?",
//     ]
//   },
//   {
//     name: "Family",
//     questions: [
//       "How do you feel about your family?",
//       "What is your favorite family tradition?",
//     ]
//   }
// ];

// const GoodMoodMix: React.FC = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isInstalling, setIsInstalling] = useState(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [serverMessage, setServerMessage] = useState('');
//   const [serverEmotion, setServerEmotion] = useState('');
//   const [installed, setInstalled] = useState(false);
//   const [songs, setSongs] = useState<string[]>([]);
//   const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [dialogQuestion, setDialogQuestion] = useState('');
//   const [dialogEmotion, setDialogEmotion] = useState('');
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunks: Blob[] = [];
//   const [audioData, setAudioData] = useState<Blob[]>();

//   useEffect(() => {
//     const installedValue = localStorage.getItem('installed');
//     if (installedValue) {
//       setInstalled(JSON.parse(installedValue));
//     }
//   }, []);

//   const startInstalling = async () => {
//     setIsInstalling(true);
//     try {
//       await performHomeRequest();
//       setInstalled(true);
//     } catch (error) {
//       console.error('Error installing', error);
//     } finally {
//       setIsInstalling(false);
//     }
//   };

//   const startRecording = async (selectedQuestion: string) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);

//       mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
//         audioChunks.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(audioChunks, { type: 'audio/webm' });
//         setAudioBlob(blob);
//         uploadAudio(blob);
//         audioChunks.splice(0, audioChunks.length);
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);

//       setTimeout(() => {
//         mediaRecorderRef.current?.stop();
//         setIsRecording(false);
//       }, 7000);
//     } catch (error) {
//       console.error('Error accessing microphone', error);
//     }
//   };

//   const uploadAudio = async (blob: Blob) => {
//     const formData = new FormData();
//     formData.append('audio_file', blob, 'audio.webm');
//     try {
//       const response = await postData(formData);
//       setServerMessage(response.data.message);
//       setServerEmotion(response.data.emotion);

//       if (response.data.question) {
//         setDialogQuestion(response.data.question);
//         setDialogEmotion(response.data.emotion);
//         setDialogOpen(true);
//       } else {
        
//         // setSongs(response.data.songs.map((song: { path: string }) => song.path));
//         console.log('Upload successful:', response.data);
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//     }
//   };

//   const fetchAudio = async (path: string) => {
//     try {
//       const response = await getSong(path)
//       const newBlob = new Blob([response.data], { type: 'audio/mp3' });
//       // setAudioData(prevAudioData => [...prevAudioData, newBlob]);
//       setAudioData(prevAudioData => {
//         if (prevAudioData === undefined) {
//           return [newBlob];
//         } else {
//           return [...prevAudioData, newBlob];
//         }
//       });

//     } catch (error) {
//       console.error('שגיאה בקריאת קובץ האודיו:', error);
//     }
//   };
//   const handleDialogConfirm = async () => {
//     const choice = 'same';
//     const songsResponse = await fetchSongs(dialogEmotion, choice);
//     const newBlob = new Blob([songsResponse.data], { type: 'audio/mp3' });

//     setSongs(songsResponse.data.songs.map((song: { path: string }) => song.path));
//       for (let index = 0; index < songsResponse.data.songs.length; index++) {
//         fetchAudio(songsResponse.data.songs[index].path)
//       }
//     console.log('Songs fetched successfully:', songsResponse.data);
//     setDialogOpen(false);
//   };

//   const handleDialogCancel = async () => {
//     const choice = 'happy';
//     const songsResponse = await fetchSongs(dialogEmotion, choice);
//     const newBlob = new Blob([songsResponse.data], { type: 'audio/mp3' });

//     setSongs(songsResponse.data.songs.map((song: { path: string }) => song.path));
//     console.log('Songs fetched successfully:', songsResponse.data);
//     setDialogOpen(false);
//   };

//   const handleCategorySelect = (index: number) => {
//     setSelectedCategoryIndex(index);
//   };

//   const handleQuestionSelect = (question: string) => {
//     startRecording(question);
//   };

//   return (
//     <Box
//       sx={{
//         backgroundImage: `url(${require('./background.jpg')})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         minHeight: '100vh',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//       }}
//     >
//       <Typography variant="h4" component="h1" gutterBottom>
//         ברוכים הבאים לשירות
//       </Typography>
//       {!installed && !isInstalling && (
//         <Button
//           variant="contained"
//           onClick={startInstalling}
//           disabled={isInstalling}
//         >
//           התקן את התוסף
//         </Button>
//       )}
//       {isInstalling && <CircularProgress />}
//       {installed && selectedCategoryIndex === null && (
//         <CategorySelector
//           categories={categories}
//           onCategorySelect={(category: Category) => handleCategorySelect(categories.indexOf(category))}
//         />
//       )}
//       {installed && selectedCategoryIndex !== null && (
//         <QuestionsList
//           questions={categories[selectedCategoryIndex].questions}
//           onQuestionSelect={handleQuestionSelect}
//         />
//       )}
//       {isRecording && (
//         <Typography variant="h6" component="p" gutterBottom>
//           מקליט...
//         </Typography>
//       )}
//       {serverMessage && (
//         <Typography variant="h6" component="p" gutterBottom>
//           {serverMessage}
//         </Typography>
//       )}
//       {serverEmotion && (
//         <Typography variant="h6" component="p" gutterBottom>
//           הרגש שהזוהה: {serverEmotion}
//         </Typography>
//       )}
//       <ConfirmDialog
//         open={dialogOpen}
//         title="Confirmation"
//         message={`${dialogQuestion} (emotion: ${dialogEmotion})`}
//         onConfirm={handleDialogConfirm}
//         onCancel={handleDialogCancel}
//       />

//       {songs.length > 0 && audioData && (
//         <Box mt={2}>
//           {audioData.map((song, index) => (
//             <Box key={index} mt={1}>
//               <audio controls>
//                 <source src={URL.createObjectURL(song)} type="audio/mp3" />
//               </audio>
//             </Box>
//           ))}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GoodMoodMix;




import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CategorySelector from '../components/CategorySelector';
import QuestionsList from '../components/Questions';
import ConfirmDialog from '../components/ConfirmDialog';
import { PlayArrow } from '@mui/icons-material';
import { postData, getSong, performHomeRequest, fetchSongs } from '../services/ser.service';

type Category = {
  name: string;
  questions: string[];
};

const categories: Category[] = [
  {
    name: "Weather",
    questions: [
      "Are you satisfied with the weather in your place today?",
      "What season of the year do you like the most, and why?",
    ]
  },
  {
    name: "Family",
    questions: [
      "How do you feel about your family?",
      "What is your favorite family tradition?",
    ]
  }
];

const GoodMoodMix: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [serverEmotion, setServerEmotion] = useState('');
  const [installed, setInstalled] = useState(false);
  const [songs, setSongs] = useState<string[]>([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [choice,setChice] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogQuestion, setDialogQuestion] = useState('');
  const [dialogEmotion, setDialogEmotion] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks: Blob[] = [];
  const [audioData, setAudioData] = useState<Blob[]>([]); // Initialize as empty array

  useEffect(() => {
    const installedValue = localStorage.getItem('installed');
    if (installedValue) {
      setInstalled(JSON.parse(installedValue));
    }
  }, []);

  const startInstalling = async () => {
    setIsInstalling(true);
    try {
      await performHomeRequest();
      setInstalled(true);
    } catch (error) {
      console.error('Error installing', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const startRecording = async (selectedQuestion: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        uploadAudio(blob);
        audioChunks.splice(0, audioChunks.length);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      }, 7000);
    } catch (error) {
      console.error('Error accessing microphone', error);
    }
  };

  const uploadAudio = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('audio_file', blob, 'audio.webm');
    try {
      const response = await postData(formData);
      setServerEmotion(response.data.emotion);

      if (response.data.question) {
        setDialogQuestion(response.data.question);
        setDialogEmotion(response.data.emotion);
        setChice(true)
        setDialogOpen(true);
      } else {
        setSongs(response.data.songs.map((song: { path: string }) => song.path));
        console.log('Upload successful:', response.data);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const fetchAudio = async (path: string) => {
    try {
      const response = await getSong(path);
      const newBlob = new Blob([response.data], { type: 'audio/mp3' });
      setAudioData(prevAudioData => [...prevAudioData, newBlob]);
    } catch (error) {
      console.error('Error fetching audio file:', error);
    }
  };

  const handleDialogCancel  = async () => {
    const choice = 'same';
    try {
      const songsResponse = await fetchSongs(dialogEmotion, choice);
      setSongs(songsResponse.data.songs.map((song: { path: string }) => song.path));
      for (let index = 0; index < songsResponse.data.songs.length; index++) {
        await fetchAudio(songsResponse.data.songs[index].path);
      }
      console.log('Songs fetched successfully:', songsResponse.data);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleDialogConfirm = async () => {
    const choice = 'your_ofer';
    try {
      const songsResponse = await fetchSongs(dialogEmotion, choice);
      setSongs(songsResponse.data.songs.map((song: { path: string }) => song.path));
      for (let index = 0; index < songsResponse.data.songs.length; index++) {
        await fetchAudio(songsResponse.data.songs[index].path);
      }
      console.log('Songs fetched successfully:', songsResponse.data);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleCategorySelect = (index: number) => {
    setSelectedCategoryIndex(index);
  };

  const handleQuestionSelect = (question: string) => {
    startRecording(question);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${require('./background.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h1" sx={{
      fontWeight: 'bold',
      mb: 1,
      color: '#ffffff',  
      textShadow: '2px 2px 4px #000000',
      backgroundImage: 'linear-gradient(90deg, #ffffff, #ee4081)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
    }}>
        Welcome to GoodMoodMix
      </Typography>
      {!installed && !isInstalling && (
        <Button  sx={{
          backgroundColor: '#ff8080',
          '&:hover': {
            backgroundColor: 'red'
          },
          '&:disabled': {
            backgroundColor: 'red'
          }
        }}
          variant="contained"
          onClick={startInstalling}
          disabled={isInstalling}
        >
          Install the plugin
        </Button>
      )}
      {isInstalling && <CircularProgress />}
      {installed && selectedCategoryIndex === null && (
        <CategorySelector
          categories={categories}
          onCategorySelect={(category: Category) => handleCategorySelect(categories.indexOf(category))}
        />
      )}
      {installed && selectedCategoryIndex !== null &&  !choice && (
        <QuestionsList
          questions={categories[selectedCategoryIndex].questions}
          onQuestionSelect={handleQuestionSelect}
        />
      )}
      {isRecording && (
        <Typography variant="h6" component="p" gutterBottom>
          recording...
        </Typography>
      )}
      {serverEmotion && (
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#ffffff', textShadow: '2px 2px 4px #000000' }}>
          Predicted emotion: {serverEmotion}
        </Typography>
      )}
      <ConfirmDialog
        open={dialogOpen}
        title="Confirmation"
        message={dialogQuestion}
        onConfirm={handleDialogConfirm}
        onCancel={handleDialogCancel}
      />

      {songs.length > 0 && audioData && (
        <Box mt={2} sx={{  ml: 3,fontWeight: 'bold',  fontSize: '55px', color: '#ffffff', textShadow: '2px 2px 4px #000000' }}>
          PlayList:
          
          {audioData.map((song, index) => (
            <Box key={index} mt={1}>
              <audio controls>
                <source src={URL.createObjectURL(song)} type="audio/mp3" />
              </audio>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default GoodMoodMix;


























// import React, { useState, useRef, useEffect } from 'react';
// import { Button, CircularProgress, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
// import { postData, getSong, performHomeRequest } from '../services/ser.service';
// import CategorySelector from '../commponets/CategorySelector';
// import QuestionsList from '../commponets/Questions';
// import { PlayArrow } from '@mui/icons-material';

// type Category = {
//   name: string;
//   questions: string[];
// };

// const categories: Category[] = [
//   {
//     name: "Weather",
//     questions: [
//       "Are you satisfied with the weather in your place today?",
//       "What season of the year do you like the most, and why?",
//     ]
//   },
//   {
//     name: "Family",
//     questions: [
//       "How do you feel about your family?",
//       "What is your favorite family tradition?",
//     ]
//   }
// ];

// const AudioRecorder: React.FC = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [isInstalling, setIsInstalling] = useState(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [serverMessage, setServerMessage] = useState('');
//   const [serverEmotion, setServerEmotion] = useState('');
//   const [installed, setInstalled] = useState(false);
//   const [songs, setSongs] = useState<string[]>([]);
//   const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunks: Blob[] = [];

//   useEffect(() => {
//     // קריאה מ-local storage
//     const installedValue = localStorage.getItem('installed');

//     // אם יש ערך מאוחסן ב-local storage, תקבע את הערך ל-installed
//     if (installedValue) {
//       setInstalled(JSON.parse(installedValue));
//     }
//   }, []);

//   const startInstalling = async () => {
//     setIsInstalling(true);
//     try {
//       await performHomeRequest();
//       setInstalled(true);
//     } catch (error) {
//       console.error('Error installing', error);
//     } finally {
//       setIsInstalling(false);
//     }
//   };

//   const startRecording = async (selectedQuestion: string) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);

//       mediaRecorderRef.current.ondataavailable = event => {
//         audioChunks.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = () => {
//         const blob = new Blob(audioChunks, { 'type': 'audio/webm' });
//         setAudioBlob(blob);
//         uploadAudio(blob);
//         audioChunks.splice(0, audioChunks.length);
//       };

//       mediaRecorderRef.current.start();
//       setIsRecording(true);

//       setTimeout(() => {
//         mediaRecorderRef.current?.stop();
//         setIsRecording(false);
//       }, 7000);

//     } catch (error) {
//       console.error('Error accessing microphone', error);
//     }
//   };

//   const fetchAudio = async (path: string) => {
//     try {
//       const response = await getSong(path);
//       const newBlob = new Blob([response.data], { type: 'audio/mp3' });
//       setAudioData(prevAudioData => {
//         if (prevAudioData === undefined) {
//           return [newBlob];
//         } else {
//           return [...prevAudioData, newBlob];
//         }
//       });
//     } catch (error) {
//       console.error('שגיאה בקריאת קובץ האודיו:', error);
//     }
//   };

//   const uploadAudio = async (blob: Blob) => {
//     const formData = new FormData();
//     formData.append('audio_file', blob, 'audio.webm');
//     try {
//       const response = await postData(formData);
//       setServerMessage(response.data.message);
//       setServerEmotion(response.data.emotion);
//       setSongs(response.data.songs.map((song: { path: string }) => song.path));
//       for (let index = 0; index < response.data.songs.length; index++) {
//         fetchAudio(response.data.songs[index].path);
//       }
//       console.log('Upload successful:', response.data);
//     } catch (error) {
//       console.error('Upload error:', error);
//     }
//   };

//   const handleCategorySelect = (index: number) => {
//     setSelectedCategoryIndex(index);
//   };

//   const handleQuestionSelect = (question: string) => {
//     startRecording(question);
//   };

//   const [audioData, setAudioData] = useState<Blob[]>();
//   const [visibleSongs, setVisibleSongs] = useState(5); // מספר השירים המוצגים לכל פעם

//   const handleShowMore = () => {
//     setVisibleSongs(visibleSongs + 5); // להוסיף עוד 5 שירים לרשימה
//   };

//   return (
//     <Box
//       sx={{
//         backgroundImage: `url(${require('./background.jpg')})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         width: '99vw',
//         height: '97vh',
//         display: 'flex',
//         flexDirection: 'column',
//         justifyContent: 'center',
//         alignItems: 'center',
//         textAlign: 'center',
//         mt: 0,
//         overflow: 'hidden'
//       }}
//     >
//       {!serverMessage && installed ? (
//         selectedCategoryIndex !== null ? (
//           <>
//             <QuestionsList
//               questions={categories[selectedCategoryIndex].questions}
//               onQuestionSelect={handleQuestionSelect}
//             />
//             <Button
//               variant="contained"
//               color={isRecording ? "secondary" : "primary"}
//               onClick={() => handleQuestionSelect(categories[selectedCategoryIndex].questions[0])}
//               disabled={isRecording}
//               startIcon={isRecording ? <CircularProgress size={20} /> : null}
//               sx={{
//                 textTransform: 'none', width: '200px', backgroundColor: '#ff8080', color: 'black', '&:hover': {
//                   backgroundColor: 'white',
//                 }
//               }}
//             >
//               {isRecording ? 'Recording...' : 'Start Recording'}
//             </Button>
//           </>
//         ) : (
//           <>
//             <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#ffffff', textShadow: '2px 2px 4px #000000' }}>
//               What would you like us to talk about today?
//             </Typography>
//             <CategorySelector
//               categories={categories}
//               onCategorySelect={(category: Category) => handleCategorySelect(categories.indexOf(category))}
//             />
//           </>
//         )
//       ) :
//         <>
//           {serverMessage && serverEmotion && (
//             <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#ffffff', textShadow: '2px 2px 4px #000000' }}
//             >
//               Predicted emotion: {serverEmotion}
//             </Typography>
//           )}
//         </>
//       }
    
//       {songs.length > 0 && audioData && (
//         <Box mt={2}>
//           {audioData.map((song, index) => (
//             <Box key={index} mt={1}>
//               <audio controls>
//                 <source src={URL.createObjectURL(song)} type="audio/mp3" />
//               </audio>
//             </Box>
//           ))}
//         </Box>
//       )}

//     </Box>
//   );
// };

// export default AudioRecorder;





// (
//   selectedCategoryIndex !== null ? (
//     <QuestionsList
//       questions={categories[selectedCategoryIndex].questions}
//       onQuestionSelect={handleQuestionSelect}
//     />
//   ) : (
//     <CategorySelector
//       categories={categories}
//       onCategorySelect={(category: Category) => handleCategorySelect(categories.indexOf(category))}
//     />
//   )
// )















