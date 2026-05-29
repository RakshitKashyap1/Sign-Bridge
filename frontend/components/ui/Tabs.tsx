import { FC, ReactNode, useState, Children, cloneElement, isValidElement } from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}

export const Tabs: FC<TabsProps> = ({ defaultValue, className, children }) => {
  const [activeValue, setActiveValue] = useState(defaultValue);

  return (
    <div className={className}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { activeValue, onTabChange: setActiveValue } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsListProps {
  className?: string;
  children: ReactNode;
  activeValue?: string;
  onTabChange?: (value: string) => void;
}

export const TabsList: FC<TabsListProps> = ({ className, children, activeValue, onTabChange }) => {
  return (
    <div className={`grid w-full grid-cols-2 ${className ?? ''}`}>
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { activeValue, onTabChange } as any);
        }
        return child;
      })}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
  activeValue?: string;
  onTabChange?: (value: string) => void;
}

export const TabsTrigger: FC<TabsTriggerProps> = ({ value, className, children, activeValue, onTabChange }) => {
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      onClick={() => onTabChange?.(value)}
      className={`px-4 py-2 text-lg font-medium rounded-md transition-colors focus-visible ${
        isActive
          ? 'bg-primary-600 text-white shadow-sm'
          : 'bg-white text-gray-600 hover:bg-gray-100'
      } ${className ?? ''}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
  activeValue?: string;
}

export const TabsContent: FC<TabsContentProps> = ({ value, className, children, activeValue }) => {
  if (activeValue !== value) return null;

  return <div className={className}>{children}</div>;
};
