import {useState} from 'react';

const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState('');

  const startListening = async () => {
    setIsListening(true);

    // MOCK: Simulate voice recognition
    setTimeout(() => {
      const simulatedResult = 'voice search';
      setVoiceText(simulatedResult);
      setIsListening(false);
    }, 1500); // Simulate 1.5s recording
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const resetVoiceInput = () => {
    setVoiceText('');
  };

  return {
    voiceText,
    isListening,
    startListening,
    stopListening,
    resetVoiceInput,
  };
};

export default useVoiceInput;
