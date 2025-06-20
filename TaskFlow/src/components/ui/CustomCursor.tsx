import React from 'react';
import { useCustomCursor } from '../../hooks/useCustomCursor';

export const CustomCursor: React.FC = () => {
  const { position, isVisible } = useCustomCursor();

  if (!isVisible) return null;

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          left: position.x - 4,
          top: position.y - 4,
        }}
      />
      <div
        className="cursor-outline"
        style={{
          left: position.x - 16,
          top: position.y - 16,
        }}
      />
    </>
  );
};