import { LocalNotifications } from '@capacitor/local-notifications';

export const scheduleTaskNotification = async (taskId: number, title: string, time: string) => {
    try {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const scheduleDate = new Date();
        scheduleDate.setHours(hours, minutes, 0, 0);

        // Si la hora ya pasó hoy, programar para mañana
        if (scheduleDate <= now) {
            scheduleDate.setDate(scheduleDate.getDate() + 1);
        }

        await LocalNotifications.schedule({
            notifications: [
                {
                    title: "¡Es hora de tu rutina!",
                    body: `Comienza ahora: ${title}`,
                    id: taskId,
                    schedule: { at: scheduleDate, repeats: true, allowWhileIdle: true },
                    sound: 'beep.wav',
                    extra: { taskId }
                }
            ]
        });
        return true;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return false;
    }
};

export const requestNotificationPermission = async () => {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
};