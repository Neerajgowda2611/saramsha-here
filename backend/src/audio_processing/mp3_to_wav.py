from pydub import AudioSegment

def convert_audio_to_wav(input_file, output_file):
    """
    Convert any audio file to WAV format.

    :param input_file: Path to the input audio file.
    :param output_file: Path to the output WAV file.
    """
    try:
        # Load the audio file (pydub supports various formats)
        audio = AudioSegment.from_file(input_file)

        # Export as WAV
        audio.export(output_file, format="wav")
    except Exception as e:
        raise RuntimeError(f"Failed to convert audio file: {str(e)}")
