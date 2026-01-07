import './globals.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import DownloadsTable from '@/components/DownloadsTable';
import { DownloadItem } from '@/hooks/useDownloadsTableItems';

// Define the global namespace for configuration if needed
declare global {
    interface Window {
        SchweigenDownloadsData?: DownloadItem[];
        renderSchweigenDownloads?: (containerId: string, data: DownloadItem[]) => void;
    }
}

// Function to mount the component
export const mountDownloadsTable = (containerId: string, data: DownloadItem[]) => {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    const root = createRoot(container);
    root.render(<DownloadsTable data={data} />);
};

// Auto-mount if a default container exists and data is available globally
if (typeof window !== 'undefined') {
    // Expose mount function globally
    window.renderSchweigenDownloads = mountDownloadsTable;

    const defaultContainerId = 'schweigen-downloads-container';
    const container = document.getElementById(defaultContainerId);

    if (container) {
        const init = async () => {
            // Attempt to parse data from a data attribute or global variable
            const dataAttr = container.getAttribute('data-items');
            const dataUrl = container.getAttribute('data-url');
            let items: DownloadItem[] = [];

            if (window.SchweigenDownloadsData) {
                items = window.SchweigenDownloadsData;
            } else if (dataAttr) {
                try {
                    items = JSON.parse(dataAttr);
                } catch (e) {
                    console.error('Failed to parse data-items attribute', e);
                }
            } else if (dataUrl) {
                try {
                    const res = await fetch(dataUrl);
                    if (res.ok) {
                        items = await res.json();
                    } else {
                        console.error('Failed to load data from URL', res.status);
                    }
                } catch (e) {
                    console.error('Failed to fetch data from URL', e);
                }
            } else {
                // Fallback or fetch logic could go here
                console.warn('No data found for Schweigen Downloads Table');
            }

            if (items.length > 0) {
                const root = createRoot(container);
                root.render(<DownloadsTable data={items} />);
            }
        };
        init();
    }
}
