import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/useAppContext';
import type { StructuredMedication } from '../utils/medicationWarnings';

const STORAGE_KEY = 'foodmapper_medication_reminders';

interface MedicationReminderData {
  medications: StructuredMedication[];
  enabled: boolean;
  notificationPermission: NotificationPermission;
}

// Helper to get initial state from localStorage
function getInitialReminderData(): MedicationReminderData {
  if (typeof window === 'undefined') {
    return {
      medications: [],
      enabled: false,
      notificationPermission: 'default',
    };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        medications: Array.isArray(parsed.medications) ? parsed.medications : [],
        enabled: parsed.enabled || false,
        notificationPermission: 'default', // Will be updated in effect
      };
    }
  } catch (error) {
    console.error('Failed to load medication reminders:', error);
  }
  return {
    medications: [],
    enabled: false,
    notificationPermission: 'default',
  };
}

export default function MedicationReminder() {
  const { t } = useTranslation();
  const { userData } = useAppContext();
  const [reminderData, setReminderData] = useState<MedicationReminderData>(getInitialReminderData);
  
  // Refs for functions to avoid dependency issues
  const checkFrequencyRef = useRef<(med: StructuredMedication) => boolean | undefined>(undefined);
  const showNotificationRef = useRef<(med: StructuredMedication) => void | undefined>(undefined);
  const initializedRef = useRef(false);

  // Load notification permission on mount
  useEffect(() => {
    if (!initializedRef.current && 'Notification' in window) {
      initializedRef.current = true;
      setReminderData(prev => ({
        ...prev,
        notificationPermission: Notification.permission,
      }));
    }
  }, []);

  // Sync with userData structuredMedications
  useEffect(() => {
    if (userData?.structuredMedications) {
      setReminderData(prev => ({
        ...prev,
        medications: userData.structuredMedications ?? [],
      }));
    }
  }, [userData?.structuredMedications]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        medications: reminderData.medications,
        enabled: reminderData.enabled,
      }));
    } catch (error) {
      console.error('Failed to save medication reminders:', error);
    }
  }, [reminderData.medications, reminderData.enabled]);

  // Define checkFrequency function
  const checkFrequency = useCallback((med: StructuredMedication): boolean => {
    switch (med.frequency) {
      case 'once_daily':
        return true;
      case 'twice_daily':
        return true; // Simplified - in reality would check if it's the right 12h interval
      case 'three_times_daily':
        return true; // Simplified
      case 'four_times_daily':
        return true; // Simplified
      case 'as_needed':
        return false; // Only manual
      default:
        return true;
    }
  }, []);

  // Define showNotification function
  const showNotification = useCallback((med: StructuredMedication) => {
    if (reminderData.notificationPermission !== 'granted') return;

    const title = t('med_reminder_notification_title');
    const body = t('med_reminder_notification_body', {
      medication: t(`medications.${med.key}`),
      brand: med.brand,
      dose: `${med.dose} ${med.unit}`,
    });

    try {
      new Notification(title, {
        body,
        icon: '/icon-192.svg',
        badge: '/icon-192.svg',
        tag: `medication-${med.key}-${med.time}`,
        requireInteraction: true,
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }, [reminderData.notificationPermission, t]);

  // Update refs
  useEffect(() => {
    checkFrequencyRef.current = checkFrequency;
  }, [checkFrequency]);

  useEffect(() => {
    showNotificationRef.current = showNotification;
  }, [showNotification]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      alert(t('med_reminder_not_supported'));
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setReminderData(prev => ({ ...prev, notificationPermission: permission }));
      if (permission === 'granted') {
        setReminderData(prev => ({ ...prev, enabled: true }));
      }
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  }, [t]);

  // Check and trigger notifications
  useEffect(() => {
    if (!reminderData.enabled || reminderData.notificationPermission !== 'granted') return;
    if (reminderData.medications.length === 0) return;

    const checkTimes = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      reminderData.medications.forEach(med => {
        if (med.time === currentTime) {
          // Check frequency
          const shouldNotify = checkFrequencyRef.current?.(med) ?? true;
          if (shouldNotify) {
            showNotificationRef.current?.(med);
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkTimes, 60000);
    checkTimes(); // Initial check

    return () => clearInterval(interval);
  }, [reminderData.enabled, reminderData.notificationPermission, reminderData.medications]);

  const toggleEnabled = () => {
    if (reminderData.notificationPermission !== 'granted') {
      requestPermission();
      return;
    }
    setReminderData(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const formatFrequency = (freq: string) => {
    return t(`med_freq_${freq}`);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-(--bg) border border-(--border) shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-(--text-h)">{t('med_reminder_title')}</h2>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={reminderData.enabled}
            onChange={toggleEnabled}
            className="sr-only peer"
          />
          <div className={`w-11 h-6 rounded-full transition-colors peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-(--accent) ${
            reminderData.enabled ? 'bg-(--accent)' : 'bg-(--border)'
          }`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow-lg transform transition-transform ${
              reminderData.enabled ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </label>
      </div>

      {reminderData.notificationPermission !== 'granted' && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm text-amber-900 dark:text-amber-200 mb-2">
            {t('med_reminder_permission_needed')}
          </p>
          <button
            type="button"
            onClick={requestPermission}
            className="px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
          >
            {t('med_reminder_enable_notifications')}
          </button>
        </div>
      )}

      {reminderData.medications.length === 0 ? (
        <div className="text-center py-8 text-(--text) italic">
          {t('med_reminder_no_medications')}
        </div>
      ) : (
        <ul className="space-y-3">
          {reminderData.medications.map((med, index) => (
            <li key={index} className="p-3 rounded-xl bg-(--code-bg) border border-(--border) flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-(--text-h)">{t(`medications.${med.key}`)}</span>
                  <span className="text-xs text-(--text) bg-(--bg) px-2 py-0.5 rounded">{med.brand}</span>
                  <span className="text-xs text-(--text) bg-(--bg) px-2 py-0.5 rounded">{med.dose} {med.unit}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-(--text)">
                  <span className="flex items-center gap-1">
                    🕐 <strong>{med.time}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    🔄 <strong>{formatFrequency(med.frequency)}</strong>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  reminderData.enabled ? 'bg-green-500/10 text-green-700 dark:text-green-300' : 'bg-(--border) text-(--text)'
                }`}>
                  {reminderData.enabled ? t('med_reminder_active') : t('med_reminder_inactive')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {reminderData.medications.length > 0 && reminderData.enabled && (
        <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            {t('med_reminder_active_info')}
          </p>
        </div>
      )}
    </div>
  );
}