import api from './api';
import { Preferences } from '@capacitor/preferences';

export const syncPendingData = async (): Promise<boolean> => {
  if (!navigator.onLine) {
    console.log('Device is offline, skipping synchronization.');
    return false;
  }

  let syncedAny = false;

  // 1. Sync pending routines
  try {
    const { value: routinesValue } = await Preferences.get({ key: 'pending_routines_sync' });
    if (routinesValue) {
      const pendingRoutines = JSON.parse(routinesValue);
      if (pendingRoutines.length > 0) {
        console.log(`Syncing ${pendingRoutines.length} pending routines...`);
        for (const routine of pendingRoutines) {
          try {
            await api.post('/routines', routine);
          } catch (err) {
            console.error('Failed to sync a specific routine, keeping in queue:', err);
            throw err; // Stop queue processing on error
          }
        }
        // Clear routine queue upon successful sync of all items
        await Preferences.remove({ key: 'pending_routines_sync' });
        syncedAny = true;
        console.log('All pending routines synced successfully.');
      }
    }
  } catch (error) {
    console.error('Error during pending routines sync:', error);
  }

  // 2. Sync pending habits tracking
  try {
    const { keys } = await Preferences.keys();
    const habitKeys = keys.filter(k => k.startsWith('pending_habits_sync_'));
    
    if (habitKeys.length > 0) {
      console.log(`Syncing ${habitKeys.length} pending habits tracking logs...`);
      for (const key of habitKeys) {
        try {
          const { value } = await Preferences.get({ key });
          if (value) {
            const { fecha, count } = JSON.parse(value);
            await api.post('/tracking', {
              fecha,
              habitos_saludables_completados: count
            });
            await Preferences.remove({ key });
            syncedAny = true;
            console.log(`Synced habits for ${fecha}`);
          }
        } catch (err) {
          console.error(`Failed to sync habits key ${key}, keeping in queue:`, err);
        }
      }
    }
  } catch (error) {
    console.error('Error during pending habits sync:', error);
  }

  return syncedAny;
};

// Setup online listener to trigger sync automatically
export const setupSyncListeners = (onSyncSuccess?: () => void) => {
  const handleOnline = async () => {
    console.log('App returned online. Triggering synchronization...');
    const result = await syncPendingData();
    if (result && onSyncSuccess) {
      onSyncSuccess();
    }
  };

  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
  };
};
