import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/Button';

export const Navigation: FC = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className="bg-white shadow-md high-contrast">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">{t('title')}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={toggleLanguage}
            aria-label="Toggle language"
          >
            {i18n.language === 'en' ? 'हिंदी' : 'English'}
          </Button>
        </div>
      </div>
    </nav>
  );
};