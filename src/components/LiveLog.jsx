import React, { useEffect, useRef } from 'react';
import { Terminal, Activity } from 'lucide-react';

const LiveLog = ({ logs, isActive }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getLogIcon = (log) => {
    if (log.includes('ERROR') || log.includes('ALERT')) return '🔴';
    if (log.includes('SUCCESS') || log.includes('Complete')) return '✅';
    if (log.includes('UPLOADED') || log.includes('extracting')) return '📦';
    if (log.includes('DETECTED')) return '⚠️';
    return '>';
  };

  return (
    <div className="live-log">
      <div className="log-header">
        <div className="log-title">
          <Terminal size={18} />
          <h3>Live Analysis Log</h3>
        </div>
        <div className={`log-status ${isActive ? 'active' : ''}`}>
          <Activity size={14} />
          <span>{isActive ? 'Active' : 'Idle'}</span>
        </div>
      </div>
      
      <div className="log-content">
        {logs.length === 0 ? (
          <div className="log-empty">
            <p>No analysis running</p>
            <p className="log-hint">Upload an APK and click ANALYZE to start</p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="log-entry" style={{ animationDelay: `${index * 0.02}s` }}>
              <span className="log-time">{log.time}</span>
              <span className="log-icon">{getLogIcon(log.message)}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default LiveLog;