import { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Video,
  Square,
  Play,
  Pause,
  Download,
  Trash2,
  Monitor,
  Camera,
  Mic,
  MicOff,
} from 'lucide-react';

interface VideoRecordingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VideoRecordingModal = ({ open, onOpenChange }: VideoRecordingModalProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'screen' | 'camera'>('screen');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = useCallback(async () => {
    try {
      let stream: MediaStream;

      if (recordingType === 'screen') {
        // Screen recording
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: audioEnabled,
        });
      } else {
        // Camera recording
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: audioEnabled,
        });
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setHasRecording(true);
        setIsRecording(false);
        setIsPaused(false);
        stopTimer();

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please ensure you have granted the necessary permissions.');
    }
  }, [recordingType, audioEnabled]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        startTimer();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        stopTimer();
        setIsPaused(true);
      }
    }
  };

  const downloadRecording = () => {
    if (recordedChunksRef.current.length > 0) {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().toISOString().slice(0, 19)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const deleteRecording = () => {
    recordedChunksRef.current = [];
    setHasRecording(false);
    setRecordingTime(0);
  };

  const closeModal = () => {
    if (isRecording) {
      stopRecording();
    }
    deleteRecording();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            In-App Video Recording
          </DialogTitle>
          <DialogDescription>
            Record your screen or camera directly within the app. Perfect for demos, tutorials, and
            team communication.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recording Type Selection */}
          <div className="flex gap-3">
            <Button
              variant={recordingType === 'screen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecordingType('screen')}
              disabled={isRecording}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Screen
            </Button>
            <Button
              variant={recordingType === 'camera' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRecordingType('camera')}
              disabled={isRecording}
            >
              <Camera className="mr-2 h-4 w-4" />
              Camera
            </Button>
            <Button
              variant={audioEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              disabled={isRecording}
            >
              {audioEnabled ? (
                <Mic className="mr-2 h-4 w-4" />
              ) : (
                <MicOff className="mr-2 h-4 w-4" />
              )}
              Audio
            </Button>
          </div>

          {/* Video Preview */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            <video ref={videoRef} autoPlay muted className="h-full w-full object-cover" />
            {!isRecording && !hasRecording && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                <div className="text-center">
                  <Video className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click start to begin {recordingType} recording
                  </p>
                </div>
              </div>
            )}

            {/* Recording Status Overlay */}
            {isRecording && (
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-sm text-white">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
                  REC {formatTime(recordingTime)}
                </div>
                {isPaused && (
                  <Badge variant="secondary" className="text-xs">
                    PAUSED
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Recording Progress */}
          {isRecording && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Recording time</span>
                <span className="font-mono">{formatTime(recordingTime)}</span>
              </div>
              <Progress value={(recordingTime % 60) * (100 / 60)} className="h-1" />
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!isRecording && !hasRecording && (
              <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                <Play className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}

            {isRecording && (
              <>
                <Button variant="outline" onClick={pauseRecording} size="sm">
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button onClick={stopRecording} variant="destructive" size="sm">
                  <Square className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              </>
            )}

            {hasRecording && !isRecording && (
              <>
                <Button onClick={downloadRecording} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button onClick={deleteRecording} variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                  <Play className="mr-2 h-4 w-4" />
                  Record Again
                </Button>
              </>
            )}
          </div>

          {/* Features Info */}
          <div className="rounded-lg bg-muted/30 p-4">
            <h4 className="mb-2 text-sm font-medium">Features:</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Record screen or camera in high quality</li>
              <li>• Pause and resume functionality</li>
              <li>• Audio recording with microphone</li>
              <li>• Download recordings locally</li>
              <li>• Perfect for demos and tutorials</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
