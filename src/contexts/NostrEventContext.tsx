import { createContext, useContext, useCallback, useState } from 'react';

interface NostrEventContextType {
    events: any[];
    addEvent: (event: any) => void;
}

export const NostrEventContext = createContext<NostrEventContextType | undefined>(undefined);

export function NostrEventProvider({ children }: { children: React.ReactNode }) {
    const [events, setEvents] = useState<any[]>([]);

    const addEvent = useCallback((event: any) => {
        setEvents((prevEvents) => [...prevEvents, event]);
    }, []);

    return (
        <NostrEventContext.Provider value={{ events, addEvent }}>
            {children}
        </NostrEventContext.Provider>
    );
}

export const useNostrEvent = () => {
    const context = useContext(NostrEventContext);
    if (!context) {
        throw new Error('useNostrEvent must be used within a NostrEventProvider');
    }
    return context;
};