'use client';

import { useEffect, useRef, useState } from 'react';
import { getSocket } from '@/lib/socket';
import { Bell } from 'lucide-react';

interface Notification {
    id: string;
    content: string;
    type: string;
    read: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_NEST_API_URL || 'https://umeko.io.vn';
export default function NotificationListener({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!userId) return;

        fetch(`${API_BASE}/notification?userId=${userId}`)
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

    const markAsUnreadBulk = async (ids: string[]) => {
        if (!ids.length) return;

        try {
            await fetch(`${API_BASE}/notification/unread-bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids }),
            });
            console.log('✅ Marked as unread:', ids);
        } catch (err) {
            console.error('❌ Failed to mark as unread:', err);
        }
    };


    return (
        <div className="relative z-50" ref={containerRef}>
            {/* Bell icon */}
            <div
                className="relative w-10 h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                    setIsOpen((prev) => {
                        const nextState = !prev;
                        if (!prev) {
                            // Chỉ gọi khi mở dropdown
                            const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
                            if (unreadIds.length > 0) {
                                markAsUnreadBulk(unreadIds);
                            }
                        }
                        return nextState;
                    });
                }}

            >
                <Bell className="w-6 h-6 text-black dark:text-white" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                        {notifications.length > 99 ? '99+' : notifications.length}
                    </span>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <h4 className="font-bold mb-2 text-black dark:text-white">🔔 Notifications</h4>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                    ) : (
                        notifications.map((noti, index) => (
                            <div
                                key={noti.id || `notification-${index}`}
                                onClick={() => {
                                    setIsOpen(!isOpen);
                                    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
                                    if (unreadIds.length > 0) {
                                        markAsUnreadBulk(unreadIds);
                                    }
                                }}
                                className="mb-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                            >
                                <p className="text-sm text-gray-900 dark:text-white break-words">{noti.content}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{noti.type}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}