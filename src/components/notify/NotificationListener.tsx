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

    // Đóng dropdown khi click ra ngoài
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
            {/* Bell icon */}
            <div className="relative cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <Bell className="w-6 h-6 text-black" />
                {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                        {notifications.length}
                    </span>
                )}
            </div>

            {/* Dropdown Notifications */}
            {isOpen && (
                <div className="mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-xl rounded-xl p-4">
                    <h4 className="font-bold mb-2 text-black">🔔 Notifications</h4>
                    {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications</p>
                    ) : (
                        notifications.map((noti, index) => (
                            <div key={index} className="mt-2 border-b pb-2">
                                <p className="text-black">{noti.content}</p>
                                <span className="text-xs text-gray-500">{noti.type}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
