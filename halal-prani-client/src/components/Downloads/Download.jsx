import React, { useEffect, useState } from 'react';
import '../styles/DownloadPage.css'; 
import Loading from '../Loading';
import Footer from '../Footer';
import DashHeader from '../My account/DashHeader';
import Dashsidelink from '../My account/Dashsidelink';

function DownloadPage() {
  const [downloadLogs, setDownloadLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    document.title = 'Downloads - Halal Prani'

    const fetchDownloads = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/downloads', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch download logs');
        }

        const data = await res.json();
        setDownloadLogs(data);
      } catch (error) {
        console.error('Error fetching downloads:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  return (
    <>
     <div className="dashboard-page">
        <DashHeader/>
        <div className="dashboard-content-area">
          <Dashsidelink />
      <div className="download-page">
        <h2 className="download-title">Downloaded Order Summaries</h2>

        {loading ? (
          <Loading />
        ) : downloadLogs.length === 0 ? (
          <p className="no-downloads">No order summary has been downloaded yet.</p>
        ) : (
          <div className="download-table-wrapper">
            <table className="download-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Download Time</th>
                </tr>
              </thead>
              <tbody>
                {downloadLogs.map((log) => (
                  <tr key={log._id}>
                    <td># {log.orderNumber}</td>
                    <td>
                    {log.downloadedAt
                        ? new Date(log.downloadedAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                        : 'N/A'}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
       </div>
        </div>
      <Footer />
    </>
  );
}

export default DownloadPage;
