import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [url, setUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [urlList, setUrlList] = useState([]);

    useEffect(() => {
        fetchUrls();
    }, []);

    const fetchUrls = async () => {
        try {
            const response = await fetch('http://localhost:5000/urls');
            const data = await response.json();
            setUrlList(data);
        } catch (error) {
            console.error('Error fetching URLs:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ original_url: url })
            });

            const data = await response.json();
            setShortUrl(data.short_url);
            setUrl(''); // Clear input
            fetchUrls(); // Refresh URL list after adding new
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to shorten URL. Is your server running?');
        }
    };

    return (
        <div className="app-container">
            <h1 className="title">🔗 Link Shortener</h1>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="input-field"
                />
                <button type="submit" className="shorten-button">Shorten</button>
            </form>

            {shortUrl && (
                <div className="result">
                    <p>Short URL:</p>
                    <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="short-link">
                        {shortUrl}
                    </a>
                </div>
            )}

            <div className="url-list">
                <h2>📋 All Shortened URLs</h2>
                {urlList.length === 0 ? (
                    <p>No URLs yet.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Short URL</th>
                                <th>Original URL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {urlList.map((item) => (
                                <tr key={item.short_id}>
                                    <td>
                                        <a
                                            href={`http://localhost:5000/${item.short_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="short-link"
                                        >
                                            http://localhost:5000/{item.short_id}
                                        </a>
                                    </td>
                                    <td style={{ wordBreak: 'break-all' }}>{item.original_url}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default App;
