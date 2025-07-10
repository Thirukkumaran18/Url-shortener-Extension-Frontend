import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './Popup.css';



function Popup() {
    const [tabUrl, setTabUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            setTabUrl(tabs[0]?.url || '');
        });
    }, []);

    const handleShorten = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('https://shorturl-8iru.onrender.com/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: tabUrl })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to shorten URL');
            setShortUrl(data.shortUrl);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
    };

    return (
        <div className="popup-container">
            <h1>URL Shortener</h1>
            <div className="url-display">
                Current URL: {tabUrl || 'None detected'}
            </div>
            <button
                onClick={handleShorten}
                disabled={loading || !tabUrl}
            >
                {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
            {shortUrl && (
                <div className="url-display">
                    <div>Short URL: {shortUrl}</div>
                    <button className="copy-button" onClick={handleCopy} >
                        {copied? '✓ Copied!' : '⎘ Copy'}
                    </button>
                </div>
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Popup />);