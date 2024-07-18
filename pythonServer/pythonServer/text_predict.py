import speech_recognition as sr
from googletrans import Translator
import os
from pydub import AudioSegment, effects
from transformers import pipeline

os.environ['PATH'] += os.pathsep + r'C:\ffmpeg\bin'
def convert_mp3_to_wav(mp3_file):

    audio = AudioSegment.from_mp3(mp3_file)

    wav_file = os.path.splitext(mp3_file)[0] + ".wav"
    audio.export(wav_file, format="wav")

    return wav_file


def audio_to_text(audio_file):
    if audio_file.endswith(".mp3"):
        audio_file = convert_mp3_to_wav(audio_file)

    recognizer = sr.Recognizer()

    with sr.AudioFile(audio_file) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data, language='he-IL')
        return text
    except sr.UnknownValueError:
        return "לא הצלחתי להבין את הדיבור"
    except sr.RequestError as e:
        return f"שגיאה בשירות: {e}"


# audio_file="D:\\Users\\רוט\\Downloads\\קינדרלעך - עולה עולה.mp3"

def translate_text(text):
    translator = Translator()
    translation = translator.translate(text, src='he', dest='en')
    return translation.text


from transformers import pipeline
def text_predict(audio_file):
    hebrew_text = audio_to_text(audio_file)
    english_translation = translate_text(hebrew_text)
    emotion_classifier = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base",
                                  return_all_scores=True)
    text = english_translation
    return emotion_classifier(text)


# results=text_predict("D:\\Users\\רוט\\Downloads\\ישי ריבו - אני שייך לעם.mp3")
# for result in results:
#     for label_result in result:
#         print(f"Label: {label_result['label']}, Score: {label_result['score']:.4f}")
#
# print([{"label": result['label'], "score": result['score']} for result in results[0] if result['score'] ==max(result['score'] for result in results[0])])
