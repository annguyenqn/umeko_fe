'use client';

import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

interface Notification {
    content: string;
    type: string;
    id?: string; // nếu bạn có id trong backend thì nên thêm
}

export default function NotificationListener({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    console.log('userid', userId);

    useEffect(() => {
        if (!userId) return;

        // 1. Gọi API lấy thông báo cũ
        fetch(`http://14.225.217.126:8084/Notification?userId=${userId}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('📦 Fetched old notifications:', data);
                setNotifications(data);
            })
            .catch((err) => {
                console.error('❌ Failed to fetch notifications:', err);
            });

        // 2. Kết nối socket
        const socket = getSocket(userId);

        socket.on('connect', () => {
            console.log('✅ Connected to socket server');
        });

        socket.on('notification', (data: Notification) => {
            console.log('📥 Realtime notification:', data);
            setNotifications((prev) => [data, ...prev]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);
    console.log('notifications', notifications);


    return (
        <div className="fixed top-4 right-4 bg-white shadow-xl p-4 rounded-xl z-50">
            <h4 className="font-bold mb-2">🔔 Notifications</h4>
            {notifications.length === 0 && (
                <p className="text-sm text-gray-500">No notifications</p>
            )}
            {notifications.map((noti, index) => (
                <div key={index} className="mt-2 border-b pb-2 text-black">
                    <p>{noti.content}</p>
                    <span className="text-xs text-gray-500">{noti.type}</span>
                </div>
            ))}
        </div>
    );
}
