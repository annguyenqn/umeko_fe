'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { Bell } from 'lucide-react';

interface Notification {
    content: string;
    type: string;
    id?: string;
}

export default function NotificationListener({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;

        fetch(`http://14.225.217.126:8084/Notification?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setNotifications(data);
            })
            .catch((err) => {
                console.error('❌ Failed to fetch notifications:', err);
            });

        const socket = getSocket(userId);

        socket.on('connect', () => {
            console.log('✅ Connected to socket server');
        });

        socket.on('notification', (data: Notification) => {
            setNotifications((prev) => [data, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-4 right-4 z-50" ref={containerRef}>
            {/* Bell icon - giữ kích thước cố định */}
            <div className="relative w-10 h-10 flex items-center justify-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <Bell className="w-6 h-6 text-black dark:text-white" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </div>

            {/* Dropdown Notifications */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-bold mb-2 text-black dark:text-white">🔔 Notifications</h4>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                    ) : (
                        notifications.map((noti, index) => (
                            <div
                                key={index}
                                className="mb-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                            >
                                <p className="text-sm text-gray-900 dark:text-white">{noti.content}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{noti.type}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>

    );
}
