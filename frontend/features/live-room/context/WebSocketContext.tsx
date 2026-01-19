'use client';

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface WebSocketContextValue {
    isConnected: boolean;
    sendMessage: (destination: string, payload: unknown) => void;
    subscribe: (destination: string, callback: (message: unknown) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined);

interface WebSocketProviderProps {
    roomId: string;
    token: string;
    children: ReactNode;
}

/**
 * Provider for WebSocket connection using SockJS and STOMP.
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ roomId, token, children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Stomp.Client | null>(null);
    const subscriptionsRef = useRef<Map<string, Stomp.Subscription>>(new Map());

    useEffect(() => {
        // Backend endpoint as configured in WebSocketConfig
        const socket = new SockJS('/ws/room');
        const client = Stomp.over(socket);

        // Disable logging in production
        if (process.env.NODE_ENV === 'production') {
            client.debug = () => { };
        }

        client.connect(
            { Authorization: `Bearer ${token}` },
            (frame) => {
                console.log('Connected to WebSocket:', frame);
                stompClientRef.current = client;
                setIsConnected(true);
            },
            (error) => {
                console.error('WebSocket connection error:', error);
                setIsConnected(false);
            }
        );

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect(() => {
                    console.log('Disconnected from WebSocket');
                });
            }
        };
    }, [token]);

    const sendMessage = useCallback((destination: string, payload: unknown) => {
        if (stompClientRef.current && isConnected) {
            stompClientRef.current.send(destination, {}, JSON.stringify(payload));
        } else {
            console.warn('Cannot send message: WebSocket not connected');
        }
    }, [isConnected]);

    const subscribe = useCallback((destination: string, callback: (message: unknown) => void) => {
        if (!stompClientRef.current || !isConnected) {
            console.warn('Cannot subscribe: WebSocket not connected');
            return () => { };
        }

        const subscription = stompClientRef.current.subscribe(destination, (msg) => {
            const body = JSON.parse(msg.body);
            callback(body);
        });

        subscriptionsRef.current.set(destination, subscription);

        return () => {
            subscription.unsubscribe();
            subscriptionsRef.current.delete(destination);
        };
    }, [isConnected]);

    return (
        <WebSocketContext.Provider value={{ isConnected, sendMessage, subscribe }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};
