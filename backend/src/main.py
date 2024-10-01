# from fastapi import FastAPI, UploadFile, File, HTTPException
# import os
# import logging
# from audio_processing.mp3_to_wav import convert_audio_to_wav  # Update import for new function
# from audio_processing.transcription import audio_to_text
# from audio_processing.summarization import summarize_text

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# app = FastAPI(debug=True)

# @app.post("/upload-audio")
# async def upload_audio(file: UploadFile = File(...)):
#     logger.info(f"Received file: {file.filename}")
#     try:
#         # Ensure the "temp" directory exists
#         os.makedirs("temp", exist_ok=True)

#         # Save the uploaded audio file to a temporary location
#         audio_file_path = os.path.join("temp", file.filename)

#         # Write the uploaded file to disk
#         with open(audio_file_path, "wb") as f:
#             f.write(await file.read())

#         # Process the audio file (transcription + summarization)
#         result = process_audio_file(audio_file_path)

#         # Return the transcription and summary
#         return result
#     except Exception as e:
#         logger.error(f"Error processing audio: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
#     finally:
#         # Clean up the uploaded audio file after processing
#         if os.path.exists(audio_file_path):
#             os.remove(audio_file_path)

# def process_audio_file(audio_file_path):
#     # Convert audio to WAV
#     wav_file_path = "temp.wav"
#     convert_audio_to_wav(audio_file_path, wav_file_path)  # Call the updated conversion function

#     try:
#         # Transcribe the WAV file to text
#         text = audio_to_text(wav_file_path)

#         # Summarize the transcribed text
#         summary = summarize_text(text)

#         # Return the transcription and summary
#         return {
#             "transcription": text,
#             "summary": summary
#         }
#     except Exception as e:
#         logger.error(f"Error processing audio file: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Error processing audio file: {str(e)}")
#     finally:
#         # Clean up the temporary WAV file
#         if os.path.exists(wav_file_path):
#             os.remove(wav_file_path)

# if __name__ == '__main__':
#     import uvicorn
#     # Start FastAPI app on port 8000
#     uvicorn.run(app, host="0.0.0.0", port=8000)


import os
import logging
from fastapi import FastAPI, UploadFile, File, HTTPException
import whisper
import requests
import json
from pydub import AudioSegment

# Configuration settings
OLLAMA_URL = "https://llm.cialabs.org/api/generate"

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(debug=True)

# Convert audio file to WAV format
def convert_audio_to_wav(input_file, output_file):
    """
    Convert any audio file to WAV format.

    :param input_file: Path to the input audio file.
    :param output_file: Path to the output WAV file.
    """
    try:
        audio = AudioSegment.from_file(input_file)
        audio.export(output_file, format="wav")
    except Exception as e:
        raise RuntimeError(f"Failed to convert audio file: {str(e)}")

# Transcribe audio to text using Whisper
def load_whisper():
    model = whisper.load_model("base", device="cpu")
    return model

def audio_to_text(audio_file):
    model = load_whisper()
    result = model.transcribe(audio_file)
    return result['text']

# Summarize the transcribed text using Ollama
def summarize_text(text):
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "model": "llama3.1",
        "prompt": f"summarize the following text: {text}"
    }
    
    try:
        response = requests.post(OLLAMA_URL, headers=headers, json=data, stream=True)
        summary = ""
        for line in response.iter_lines(decode_unicode=True):
            if line:
                try:
                    result = json.loads(line)
                    if result.get("done"):
                        break
                    summary += result.get("response", "")
                except ValueError as e:
                    logger.error(f"Error during parsing: {str(e)}")
                    return None
        return summary.strip() if summary else "No summary generated"
    except Exception as e:
        logger.error(f"Error during summarization: {str(e)}")
        return None

# Process the audio file (convert, transcribe, summarize)
def process_audio_file(audio_file_path):
    wav_file_path = "temp.wav"
    convert_audio_to_wav(audio_file_path, wav_file_path)

    try:
        # Transcribe the WAV file
        text = audio_to_text(wav_file_path)

        # Summarize the transcribed text
        summary = summarize_text(text)

        # Return transcription and summary
        return {
            "transcription": text,
            "summary": summary
        }
    except Exception as e:
        logger.error(f"Error processing audio file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing audio file: {str(e)}")
    finally:
        # Clean up temporary WAV file
        if os.path.exists(wav_file_path):
            os.remove(wav_file_path)

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    logger.info(f"Received file: {file.filename}")
    try:
        # Ensure the "temp" directory exists
        os.makedirs("temp", exist_ok=True)

        # Save the uploaded audio file to a temporary location
        audio_file_path = os.path.join("temp", file.filename)

        # Write the uploaded file to disk
        with open(audio_file_path, "wb") as f:
            f.write(await file.read())

        # Process the audio file (transcription + summarization)
        result = process_audio_file(audio_file_path)

        # Return transcription and summary
        return result
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")
    finally:
        # Clean up the uploaded audio file after processing
        if os.path.exists(audio_file_path):
            os.remove(audio_file_path)

if __name__ == '__main__':
    import uvicorn
    # Start FastAPI app on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)

