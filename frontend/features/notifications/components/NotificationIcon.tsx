import { Bell, GraduationCap, ClipboardList, ShieldAlert, Calendar, FileEdit, Info } from 'lucide-react';
import { NotificationType } from '../types';

interface NotificationIconProps {
    type: NotificationType;
    className?: string;
}

/**
 * Maps a NotificationType to its corresponding Lucide icon and semantic color.
 * 
 * @param type The category of the notification.
 * @param className Optional CSS classes for styling the SVG.
 */
export const NotificationIcon = ({ type, className = "h-4 w-4" }: NotificationIconProps) => {
    switch (type) {
        case NotificationType.EXAM_SUBMITTED:
            return <ClipboardList className={`${className} text-blue-500`} />;
        case NotificationType.EXAM_GRADED:
            return <GraduationCap className={`${className} text-green-500`} />;
        case NotificationType.EXAM_ASSIGNED:
        case NotificationType.SCHEDULE_CREATED:
        case NotificationType.SCHEDULE_UPDATED:
        case NotificationType.SESSION_CREATED:
            return <Bell className={`${className} text-orange-500`} />;
        case NotificationType.SESSION_RESCHEDULED:
            return <Calendar className={`${className} text-orange-500`} />;
        case NotificationType.EXAM_UPDATED:
            return <FileEdit className={`${className} text-blue-500`} />;
        case NotificationType.SYSTEM:
            return <ShieldAlert className={`${className} text-red-500`} />;
        default:
            return <Info className={`${className} text-gray-500`} />;
    }
};
