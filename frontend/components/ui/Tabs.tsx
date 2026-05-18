import { FC, ReactNode } from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}

export const Tabs: FC<TabsProps> = ({ defaultValue, className, children }) => {
  return <div data-default-value={defaultValue} className={className}>{children}</div>;
};

interface TabsListProps {
  className?: string;
  children: ReactNode;
}

export const TabsList: FC<TabsListProps> = ({ className, children }) => {
  return <div className={`grid w-full grid-cols-2 ${className}`}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export const TabsTrigger: FC<TabsTriggerProps> = ({ value, className, children }) => {
  return (
    <button
      role="tab"
      data-value={value}
      className={`px-4 py-2 text-lg font-medium rounded-md transition-colors focus-visible ${className}`}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export const TabsContent: FC<TabsContentProps> = ({ value, className, children }) => {
  return <div data-value={value} className={className}>{children}</div>;
};