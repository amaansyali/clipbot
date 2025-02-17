import { useState, useEffect } from "react";
import apiClient from "../services/api-client";

export interface Channel {
    channel_name: string;
    channel_id: string;
}

export interface ConnectedChannels {
    youtube: Channel[];
    linkedin: Channel[];
    instagram: Channel[];
    tiktok: Channel[];
}

export function useFetchChannels() {
    const [connectedChannels, setChannels] = useState<ConnectedChannels | null>(null);
    const [isFetchChannelsLoading, setIsLoading] = useState<boolean>(false);
    const [fetchChannelsError, setFetchChannelsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                setIsLoading(true);
                const response = await apiClient.get("/fetchchannels");
                console.log(response.data.channels);
                setChannels(response.data.channels);
            } catch (error) {
                console.error("Error fetching channels:", error);
                setFetchChannelsError("Failed to fetch channels");
            } finally {
                setIsLoading(false);
            }
        };

        fetchChannels();
    }, []);

    return { connectedChannels, isFetchChannelsLoading, fetchChannelsError };
}