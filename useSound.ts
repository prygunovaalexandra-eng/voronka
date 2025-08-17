import React, { useCallback, useRef, useEffect } from 'react';

export const useSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Предзагружаем аудио при инициализации хука
  useEffect(() => {
    if (!audioRef.current) {
      console.log('Preloading audio...');
      audioRef.current = new Audio('/sounds/flipping_paper.mp3');
      audioRef.current.volume = 0.3;
      audioRef.current.preload = 'auto';
      
      // Принудительно загружаем аудио
      audioRef.current.load();
      
      // Добавляем обработчики событий для отладки
      audioRef.current.addEventListener('loadstart', () => console.log('Audio loading started'));
      audioRef.current.addEventListener('canplay', () => console.log('Audio can play'));
      audioRef.current.addEventListener('error', (e) => console.error('Audio error:', e));
      audioRef.current.addEventListener('play', () => console.log('Audio started playing'));
      audioRef.current.addEventListener('ended', () => console.log('Audio finished playing'));
    }
  }, []);

  const playCardFlip = useCallback(async () => {
    try {
      console.log('Attempting to play sound...');
      
      if (!audioRef.current) {
        console.log('Audio not ready, creating...');
        audioRef.current = new Audio('/sounds/flipping_paper.mp3');
        audioRef.current.volume = 0.3;
        audioRef.current.preload = 'auto';
        audioRef.current.load();
      }

      const audio = audioRef.current;
      console.log('Audio element ready, attempting to play...');

      // Сбрасываем время и запускаем немедленно
      audio.currentTime = 0;
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('Real paper flipping sound played successfully');
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      
      // Попробуем альтернативный способ
      try {
        console.log('Trying alternative playback method...');
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.error('Alternative method failed:', e));
        }
      } catch (altError) {
        console.error('Alternative method also failed:', altError);
      }
    }
  }, []);

  return { playCardFlip };
}; 