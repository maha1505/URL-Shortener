import React, { useEffect, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch(`${API_BASE}/urls`);
      const data = await res.json();
      setUrls(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load URLs");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original_url: originalUrl })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortUrl(data.short_url);
      setOriginalUrl("");
      fetchUrls();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="app-title">URL Shortener</h1>
        <p className="subtitle">
          Create short, shareable links instantly
        </p>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="url"
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <button disabled={loading}>
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        {shortUrl && (
          <div className="result">
            <span>Short URL</span>
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </div>
        )}
      </div>

      <div className="table-card">
        <h2>Shortened Links</h2>

        {urls.length === 0 ? (
          <p className="empty">No URLs created yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Short URL</th>
                <th>Original URL</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((item) => (
                <tr key={item.short_id}>
                  <td>
                    <a
                      href={`${API_BASE}/${item.short_id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {API_BASE}/{item.short_id}
                    </a>
                  </td>
                  <td className="break">
                    {item.original_url}
                  </td>
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
