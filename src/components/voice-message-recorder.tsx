import React, { useState } from "react";
import useVoiceRecorder from "@/hooks/useVoiceRecorder.tsx";

type VoiceMessageRecorderProps = {
  onVoiceMessageRecorded: (audioBlob: Blob) => void;
}

const VoiceMessageRecorder = ({onVoiceMessageRecorded}: VoiceMessageRecorderProps) => {
  const { isRecording, startRecording, stopRecording, error } = useVoiceRecorder();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartRecording = async () => {
    await startRecording();
  };

  const handleStopRecording = async () => {
    setIsLoading(true);
    try {
      const audioBlob = await stopRecording();
      onVoiceMessageRecorded(audioBlob);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="voice-message-recorder">
      {error && <div className="error">{error}</div>}
      <button
        onClick={isRecording ? handleStopRecording : handleStartRecording}
        disabled={isLoading}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <div className="recording-indicator">Recording...</div>}
    </div>
  );
};

export default VoiceMessageRecorder;