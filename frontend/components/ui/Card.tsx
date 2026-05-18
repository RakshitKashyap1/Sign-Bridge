import { FC, ReactNode } from 'react';

interface CardProps {
  className?: string;
  children: ReactNode;
}

export const Card: FC<CardProps> = ({ className = '', children }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md high-contrast ${className}`}>
      {children}
    </div>
  );
};