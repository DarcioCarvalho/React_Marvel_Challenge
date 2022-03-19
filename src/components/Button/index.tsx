import { useEffect, useState } from 'react';
import styles from './styles.module.scss';

interface ButtonProps {
  titleButton: string;
  colorTitle: string;
  bgColor: string;
  icon?: string;
  onClick: () => void;
}
export function Button({ titleButton, colorTitle, bgColor, onClick }: ButtonProps) {
  const [newColorTitle, setNewColorTitle] = useState<string>()
  const [newBgColor, setNewBgColor] = useState<string>()

  useEffect(() => {
    setNewColorTitle(global.window.getComputedStyle(document.documentElement).getPropertyValue(colorTitle))
    setNewBgColor(global.window.getComputedStyle(document.documentElement).getPropertyValue(bgColor))
  }, []);

  return (
    <button
      style={{ backgroundColor: newBgColor, color: newColorTitle }}
      className={styles.buttonContainer}
      onClick={onClick}
      type='button'
    >
      {titleButton}
    </button>
  );
}