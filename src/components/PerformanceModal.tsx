import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { measurePerformance } from '../utils/performance';

interface PerformanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface PerformanceWithMemory extends Performance {
  memory?: PerformanceMemory;
}

interface PerformanceStats {
  renderTime?: number;
  memory?: number;
  storage?: {
    quota?: number;
    usage?: number;
  };
}

export default function PerformanceModal({ isOpen, onClose }: PerformanceModalProps) {
  const { t } = useTranslation();
  const [stats, setStats] = useState<PerformanceStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        let renderDuration: number | undefined;
        measurePerformance('PerformanceModal render', () => {
          renderDuration = performance.now();
        });

        // Get memory information if available
        const performanceExtended = performance as PerformanceWithMemory;
        const memory = performanceExtended.memory?.usedJSHeapSize;

        // Get storage information if available
        let storageEstimateObj: StorageEstimate | undefined;
        if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
          storageEstimateObj = await navigator.storage.estimate();
        }

        if (isMounted) {
          setStats({
            renderTime: renderDuration,
            memory: memory ? Math.round(memory / 1024 / 1024) : undefined,
            storage: storageEstimateObj ? {
              quota: storageEstimateObj.quota ? Math.round(storageEstimateObj.quota / 1024 / 1024) : undefined,
              usage: storageEstimateObj.usage !== undefined ? Math.round(storageEstimateObj.usage / 1024 / 1024) : undefined
            } : undefined
          });
        }
      } catch (error) {
        console.error('Failed to fetch performance stats:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Focus the close button when the modal opens
  useEffect(() => {
    if (isOpen && !isLoading) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen, isLoading]);

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="performance-modal-title"
    >
      <div className="bg-(--bg) text-(--text) p-6 rounded-xl shadow-xl w-full max-w-md border border-(--border)">
        <h2 id="performance-modal-title" className="text-xl font-bold mb-4 text-(--text-h)">
          {t('performance_modal')}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-(--accent) border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            {stats.memory !== undefined && (
              <div className="flex justify-between items-center py-1.5 border-b border-(--border)">
                <span className="font-medium text-(--text-h)">{t('performance_memory')}:</span>
                <span className="font-semibold">{stats.memory} MB</span>
              </div>
            )}

            {stats.storage && (
              <div className="flex justify-between items-center py-1.5 border-b border-(--border)">
                <span className="font-medium text-(--text-h)">{t('performance_disk') || t('performance_storage')}:</span>
                <span className="font-semibold">
                  {stats.storage.usage !== undefined ? `${stats.storage.usage} MB` : t('performance_unavailable')}
                  {stats.storage.quota !== undefined && ` / ${stats.storage.quota} MB`}
                </span>
              </div>
            )}

            {stats.memory === undefined && !stats.storage && (
              <div className="text-center py-4 text-(--text)">
                {t('performance_unavailable')}
              </div>
            )}
          </div>
        )}

        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="mt-6 w-full px-4 py-2.5 bg-(--accent) text-white rounded-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-(--accent) cursor-pointer"
          aria-label={t('performance_close')}
        >
          {t('performance_close')}
        </button>
      </div>
    </div>
  );
}
