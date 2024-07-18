from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pyodbc
from keras.models import load_model
import os
from predict_emotion import predict_emotion
from pydub import AudioSegment
from pydub.utils import mediainfo
import glob
import random
import tempfile
import zipfile

# model = load_model('model_NEW111.h5')

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

emotions_dict = {
    'joy': 'moving music',
    'sadness': 'happy music',
    'surprise': 'neutral',
    'disgust': 'happy music',
    'fear': 'neutral/calm music',
    'neutral': 'happy music'
}
# Connecting to SQL and importing the routes where the song's emotion matches the received emotion
def get_songs_by_emotion(emotion):
    # server = 'SEMINAR-SQL\MTM'
    server = '(localdb)\\MSSQLLocalDB'
    database = 'GoodMoodMix'
    conn_str = f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;'
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()
    query = "SELECT path FROM songs WHERE emotion = ?"
    cursor.execute(query, (emotion,))

    rows = cursor.fetchall()
    songs = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    conn.close()
    return songs


@app.route('/api/')
def home():
    save_audio_files_to_db()
    return "Hello, Flask!"


@app.route('/api/get_audio')
def get_audio():
    audio_file_path = request.args.get('path', '')
    if audio_file_path:
        print(audio_file_path)
        return send_file(audio_file_path, as_attachment=True)


#
@app.route('/api/upload_audio', methods=['POST'])
def upload_audio():
    print("i am here")
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['audio_file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    audio = AudioSegment.from_file(file)
    wav_path = 'converted_audio.wav'
    audio.export(wav_path, format='wav')

    emotion = predict_emotion(wav_path)

    return jsonify({
        'message': 'Received audio file successfully',
        'emotion': emotion,
        'question': f'I offer you songs related to emotion: {emotions_dict[emotion]}. Are you interested?'}), 200


@app.route('/api/get_songs', methods=['POST'])
def get_songs():
    data = request.json
    emotion = data.get('emotion')
    choice = data.get('choice')
    if choice == 'same':
        songs = get_songs_by_emotion(emotion)
    else:
        songs = get_songs_by_emotion(emotions_dict[emotion])


    return jsonify({'songs': songs}), 200

# Connecting to the music folder, classifying by emotions, and saving to the database
def save_audio_files_to_db():
    server = '(localdb)\\MSSQLLocalDB'
    database = 'GoodMoodMix'
    conn_str = f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;'
    conn = pyodbc.connect(conn_str)
    cursor = conn.cursor()


    path = "D:\\Users\\רוט\\Music\\MusicForclassification"
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith('.mp3') or file.endswith('.wav'):
                file_path = os.path.join(root, file)
                os.environ['PATH'] += os.pathsep + r'C:\ffmpeg\bin'
                try:
                    emotion = predict_emotion(file_path)
                    cursor.execute("INSERT INTO songs (path, emotion) VALUES (?, ?)", (file_path, emotion))
                except Exception as e:
                    print(f"Failed to process {file_path}: {str(e)}")

    conn.commit()
    conn.close()


if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=3001)

import pyodbc
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from keras.models import load_model
import os
from predict_emotion import predict_emotion
from pydub import AudioSegment
from pydub.utils import mediainfo
import glob
import random
import tempfile
import zipfile

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

emotions_dict = {
    'joy': 'moving music',
    'sadness': 'happy music',
    'surprise': 'neutral',
    'disgust': 'happy music',
    'fear': 'neutral/calm music',
    'neutral': 'happy music'
}

def get_songs_by_emotion(emotion):
    server = '(localdb)\\MSSQLLocalDB'
    database = 'GoodMoodMix'
    conn_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;'
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        query = "SELECT path FROM songs WHERE emotion = ?"
        cursor.execute(query, (emotion,))

        rows = cursor.fetchall()
        songs = [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    except pyodbc.Error as e:
        print("Error in connection:", e)
        songs = []
    finally:
        conn.close()
    return songs

@app.route('/api/')
def home():
    save_audio_files_to_db()
    return "Hello, Flask!"

@app.route('/api/get_audio')
def get_audio():
    audio_file_path = request.args.get('path', '')
    if audio_file_path:
        print(audio_file_path)
        return send_file(audio_file_path, as_attachment=True)

@app.route('/api/upload_audio', methods=['POST'])
def upload_audio():
    print("i am here")
    if 'audio_file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['audio_file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    audio = AudioSegment.from_file(file)
    wav_path = 'converted_audio.wav'
    audio.export(wav_path, format='wav')

    emotion = predict_emotion(wav_path)

    return jsonify({
        'message': 'Received audio file successfully',
        'emotion': emotion,
        'question': f'I offer you songs related to emotion: {emotions_dict[emotion]}. Are you interested?'
    }), 200

@app.route('/api/get_songs', methods=['POST'])
def get_songs():
    data = request.json
    emotion = data.get('emotion')
    choice = data.get('choice')
    if choice == 'same':
        songs = get_songs_by_emotion(emotion)
    else:
        songs = get_songs_by_emotion(emotions_dict[emotion])

    return jsonify({'songs': songs}), 200

def save_audio_files_to_db():
    server = '(localdb)\\MSSQLLocalDB'
    database = 'GoodMoodMix'
    conn_str = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};Trusted_Connection=yes;'
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        path = "D:\\Users\\רוט\\Music\\MusicForclassification"
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.mp3') or file.endswith('.wav'):
                    file_path = os.path.join(root, file)
                    os.environ['PATH'] += os.pathsep + r'C:\ffmpeg\bin'
                    try:
                        emotion = predict_emotion(file_path)
                        cursor.execute("INSERT INTO songs (path, emotion) VALUES (?, ?)", (file_path, emotion))
                    except Exception as e:
                        print(f"Failed to process {file_path}: {str(e)}")

        conn.commit()
    except pyodbc.Error as e:
        print("Error in connection:", e)
    finally:
        conn.close()

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=3001)
