from bestModelForSongs import predict_audio
from text_predict import text_predict
def predict_emotion(path):
    audio_prediction = predict_audio(path)
    text_prediction = text_predict(path)
    scores = []

    scores.append({'label': 'anger', 'score': text_prediction[0][0]['score'] + audio_prediction[0][0]})
    scores.append({'label': 'disgust', 'score': text_prediction[0][1]['score'] + audio_prediction[0][1]})
    scores.append({'label': 'fear', 'score': text_prediction[0][2]['score'] + audio_prediction[0][2]})
    scores.append({'label': 'joy', 'score': text_prediction[0][3]['score'] + audio_prediction[0][3]})
    scores.append({'label': 'neutral', 'score': text_prediction[0][4]['score'] + audio_prediction[0][4]})
    scores.append({'label': 'sadness', 'score': text_prediction[0][5]['score'] + audio_prediction[0][5]})
    scores.append({'label': 'surprise', 'score': text_prediction[0][6]['score'] + audio_prediction[0][6]})

    max_score = max(scores, key=lambda x: x['score'])

    print(f"Max Label: {max_score['label']}, Max Score: {max_score['score']}")
    return max_score['label']
