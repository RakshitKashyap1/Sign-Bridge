import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, Trash2, Bookmark, History } from 'lucide-react';
import { HistoryEntry } from '../hooks/useHistory';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onSelectInput?: (input: string) => void;
}

export const HistoryPanel: FC<HistoryPanelProps> = ({
  entries,
  onToggleFavorite,
  onRemove,
  onClear,
  onSelectInput,
}) => {
  const { t } = useTranslation();
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filtered = showFavoritesOnly ? entries.filter((e) => e.favorite) : entries;

  const typeLabel = (type: string) => {
    switch (type) {
      case 'gesture_to_text': return '✋→📝';
      case 'text_to_gesture': return '📝→✋';
      case 'speech_to_gesture': return '🎤→✋';
      default: return type;
    }
  };

  if (entries.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">{t('history')}</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={showFavoritesOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Bookmark className="w-4 h-4 mr-1" />
            {t('favorites')}
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filtered.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <span className="text-sm shrink-0">{typeLabel(entry.type)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {entry.input || entry.output}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {entry.details || entry.output}
                </p>
              </div>
              {entry.confidence !== undefined && entry.confidence > 0 && (
                <span className="text-xs text-gray-400 shrink-0">
                  {(entry.confidence * 100).toFixed(0)}%
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1 shrink-0 ml-2">
              <button
                onClick={() => onToggleFavorite(entry.id)}
                className={`p-1 rounded transition-colors ${
                  entry.favorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                }`}
              >
                <Star className="w-4 h-4" fill={entry.favorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => onRemove(entry.id)}
                className="p-1 rounded text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          {showFavoritesOnly ? 'No favorites yet' : t('noHandsDetected')}
        </p>
      )}
    </Card>
  );
};
