import { useState, useEffect } from 'react';
import { useElectron } from "@/components/useElectron";
import { port } from "@/components/serialTypes";

export const usePortConnection = () => {
    const electron = useElectron();
    const [availablePorts, setAvailablePorts] = useState<port[]>([]);
    const [selectedPort, setSelectedPort] = useState<string>("");
    const [showPortDialog, setShowPortDialog] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handlePortConnection = async (port: string) => {
        if (!electron) return;
        try {
            console.log("Connecting to port", port);
            await electron.connect(port);
            setIsConnected(true);
            setShowPortDialog(false);
            setError("");
        } catch (err) {
            setError(`Failed to connect to port ${port}: ${err}`);
        }
    };

    const handleDisconnect = async () => {
        if (!electron) return;
        try {
            console.log("Disconnecting from port");
            electron.disconnect();
            setIsConnected(false);
            setShowPortDialog(false);
            setError("");
        } catch (err) {
            setError(`Failed to disconnect from port: ${err}`);
        }
    };

    // Initialize ports on mount
    useEffect(() => {
        if (!electron) return;

        const initializePorts = async () => {
            if (!isConnected) {
                try {
                    const ports = await electron.listPorts();
                    setAvailablePorts(ports.ports);
                    setShowPortDialog(true);
                } catch (err) {
                    setError(`Failed to list ports: ${err}`);
                }
            }
        };

        initializePorts();
    }, [electron, isConnected]);

    return {
        availablePorts,
        selectedPort,
        setSelectedPort,
        showPortDialog,
        setShowPortDialog,
        isConnected,
        error,
        setError,
        handlePortConnection,
        handleDisconnect
    };
};