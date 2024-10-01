package com.saramsha;

import android.app.Service;
import android.content.Intent;
import android.media.MediaRecorder;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;

public class AudioService extends Service {

    private static final String TAG = "AudioService";
    private MediaRecorder mediaRecorder;

    @Override
    public void onCreate() {
        super.onCreate();
        mediaRecorder = new MediaRecorder();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String filePath = intent.getStringExtra("filePath");
        startForegroundRecording(filePath);
        return START_STICKY;
    }

    private void startForegroundRecording(String filePath) {
        // Configure the MediaRecorder
        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
        mediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
        mediaRecorder.setOutputFile(filePath);

        try {
            mediaRecorder.prepare();
            mediaRecorder.start();
            Log.d(TAG, "Recording started");
        } catch (Exception e) {
            Log.e(TAG, "Error starting recording: " + e.getMessage());
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mediaRecorder.stop();
        mediaRecorder.release();
        Log.d(TAG, "Recording stopped");
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
