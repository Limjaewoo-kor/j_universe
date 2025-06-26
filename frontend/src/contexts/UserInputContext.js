// src/contexts/UserInputContext.js

import { createContext, useState } from 'react';

export const UserInputContext = createContext();

export function UserInputProvider({ children }) {
  const [purpose, setPurpose] = useState('');
  const [inputText, setInputText] = useState('');
  const [tone, setTone] = useState('');
  const [resultText, setResultText] = useState('');
  const [length, setLength] = useState('중간');
  const [emoji, setEmoji] = useState(false);

  const contextValue = {
    purpose,
    setPurpose,
    inputText,
    setInputText,
    tone,
    setTone,
    resultText,
    setResultText,
    length, setLength,
    emoji, setEmoji,
  };

  return (
    <UserInputContext.Provider value={contextValue}>
      {children}
    </UserInputContext.Provider>
  );
}
