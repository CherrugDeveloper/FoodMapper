import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface NotificationPermissionState {
  permission: NotificationPermission | 'unsupported';
  requestPermission: () => Promise<void>;
}

export const useNotificationPermission = (): NotificationPermissionState => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const checkNotificationSupport = useCallback(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
      alert(t('med_reminder_not_supported'));
      return false;
    }
    return true;
  }, [t]);

  const logPermissionError = useCallback((error: unknown) => {
    console.error('Notification permission error:', error);
    if (typeof error === 'string') {
      alert(error);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!checkNotificationSupport()) {
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
    } catch (error) {
      logPermissionError(error);
      setPermission('denied');
    }
  }, [checkNotificationSupport, logPermissionError, t]);

  useEffect(() => {
    if (isLoading) {
      const checkAndRequestPermission = async () => {
        if (checkNotificationSupport()) {
          await requestPermission();
        }
        setIsLoading(false);
      };
      checkAndRequestPermission();
    }
  }, [isLoading, checkNotificationSupport, requestPermission]);

  return {
    permission,
    requestPermission,
    isLoading,
  };
};