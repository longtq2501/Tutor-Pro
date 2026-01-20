'use client';

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

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
 * Provider for WebSocket connection using SockJS and @stomp/stompjs.
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ roomId, token, children }) => {
    const [isConnected, setIsConnected] = useState(false);
    const stompClientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());

    useEffect(() => {
        const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');

        // Backend endpoint as configured in WebSocketConfig
        // Using webSocketFactory for SockJS compatibility
        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws/room`),
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                if (process.env.NODE_ENV !== 'production') {
                    console.log(str);
                }
            },
            reconnectDelay: 5000, // Auto reconnect
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('Connected to WebSocket:', frame);
            setIsConnected(true);
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            setIsConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log('WebSocket connection closed');
            setIsConnected(false);
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
                setIsConnected(false);
            }
        };
    }, [token]);

    const sendMessage = useCallback((destination: string, payload: unknown) => {
        if (stompClientRef.current && isConnected) {
            stompClientRef.current.publish({
                destination,
                body: JSON.stringify(payload)
            });
        } else {
            console.warn('Cannot send message: WebSocket not connected');
        }
    }, [isConnected]);

    const subscribe = useCallback((destination: string, callback: (message: unknown) => void) => {
        if (!stompClientRef.current || !isConnected) {
            console.warn('Cannot subscribe: WebSocket not connected');
            return () => { };
        }

        const subscription = stompClientRef.current.subscribe(destination, (msg: IMessage) => {
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


