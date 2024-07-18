from bestModelForSongs import predict_audio
from text_predict import text_predict
if __name__ == '__main__':
    # app.run(debug=True, host='localhost', port=3001)
    audio_file = "D:\\Users\\רוט\\Downloads\\פעם את לילה- שי המבר- קריוקי! (256 kbps).mp3"
    # audio_file="D:\\Users\\רוט\\Downloads\\Music\\Playlists\\חנן בן ארי - שבורי לב (קליפ רשמי) Hanan Ben Ari.mp3"
    emotions = predict_audio(audio_file)
    print(emotions)
    results=text_predict(audio_file);

    print(f"Label: anger, Score: {results[0][0]['score'] + emotions[0][0]}")
    print(f"Label: disgust, Score: {results[0][1]['score'] + emotions[0][1]}")
    print(f"Label: fear, Score: {results[0][2]['score'] + emotions[0][2]}")
    print(f"Label: joy, Score: {results[0][3]['score'] + emotions[0][3]}")
    print(f"Label: neutral, Score: {results[0][4]['score'] + emotions[0][4]}")
    print(f"Label: sadness, Score: {results[0][5]['score'] + emotions[0][5]}")
    print(f"Label: surprise, Score: {results[0][6]['score'] + emotions[0][6]}")
