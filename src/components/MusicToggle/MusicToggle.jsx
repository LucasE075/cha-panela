import { useMusic } from '@/context';
import './musicToggle.css';

export default function MusicToggle() {
  const { isPlaying, toggleMusic } = useMusic();

  return (
    <button 
      className="botao-audio-global" 
      onClick={toggleMusic}
      aria-label="Alternar música"
    >
      {isPlaying ? '🔊' : '🔇'}
    </button>
  );
}
