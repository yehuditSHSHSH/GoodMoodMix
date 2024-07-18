from keras.models import load_model
import torchaudio
import os
import numpy as np
import librosa
from tensorflow.keras.models import model_from_json
import pickle

os.environ['PATH'] += os.pathsep + r'C:\ffmpeg\bin'

# טעינת מבנה המודל מהקובץ JSON
json_file = open('CNN_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
loaded_model = model_from_json(loaded_model_json)

# טעינת משקלים למודל
loaded_model.load_weights("CNN_model_weights.weights.h5")
print("Loaded model from disk")

emotions1 = {1: 'Neutral', 2: 'Calm', 3: 'Happy', 4: 'Sad', 5: 'Angry', 6: 'Fear', 7: 'Disgust', 8: 'Surprise'}

with open('scaler2.pickle', 'rb') as f:
    scaler2 = pickle.load(f)

with open('encoder2.pickle', 'rb') as f:
    encoder2 = pickle.load(f)


def zcr(data, frame_length, hop_length):
    zcr = librosa.feature.zero_crossing_rate(data, frame_length=frame_length, hop_length=hop_length)
    return np.squeeze(zcr)


def rmse(data, frame_length=2048, hop_length=512):
    rmse = librosa.feature.rms(y=data)
    # rmse=librosa.feature.rms(data,frame_length,hop_length)
    return np.squeeze(rmse)


def mfcc(data, sr, frame_length=2048, hop_length=512, flatten: bool = True):
    # mfcc=librosa.feature.mfcc(data,sr=sr)
    mfcc = librosa.feature.mfcc(y=data, sr=sr)
    return np.squeeze(mfcc.T) if not flatten else np.ravel(mfcc.T)


def extract_features(data, sr=22050, frame_length=2048, hop_length=512):
    result = np.array([])

    result = np.hstack((result,
                        zcr(data, frame_length, hop_length),
                        rmse(data, frame_length, hop_length),
                        mfcc(data, sr, frame_length, hop_length)
                        ))
    return result


def get_predict_feat(path):
    d, s_rate = librosa.load(path, duration=2.5, offset=0.6)
    res = extract_features(d)
    result = np.array(res)
    result = np.reshape(result, newshape=(1, 2376))
    i_result = scaler2.transform(result)
    final_result = np.expand_dims(i_result, axis=2)

    return final_result


def predict_audio(path):
    res = get_predict_feat(path)
    predictions = loaded_model.predict(res)
    y_pred = encoder2.inverse_transform(predictions)
    # print(y_pred[0][0])
    exp_predictions = np.exp(predictions - np.max(predictions, axis=1, keepdims=True))
    normalized_predictions = exp_predictions / np.sum(exp_predictions, axis=1, keepdims=True)
    return normalized_predictions
