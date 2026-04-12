import React from 'react';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';

const RiskScore = ({ score, isMalicious, anomalyAlert }) => {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 67) return '#ef4444';
    if (score >= 34) return '#f59e0b';
    return '#10b981';
  };

  // Determine label
  const getRiskLabel = () => {
    if (score >= 67) return 'MALICIOUS';
    if (score >= 34) return 'SUSPICIOUS';
    return 'SAFE';
  };

  const scoreColor = getScoreColor();
  const riskLabel = getRiskLabel();
  
  // Calculate circle properties
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="risk-score-container">
      <div className="risk-score-card">
        <h3 className="section-title">Risk Assessment</h3>
        
        <div className="score-visual">
          <svg className="circular-chart" width="280" height="280">
            {/* Background circle */}
            <circle
              className="circle-bg"
              r={radius}
              cx="140"
              cy="140"
              stroke="#2a2e4a"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              className="circle-progress"
              r={radius}
              cx="140"
              cy="140"
              stroke={scoreColor}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
            />
            {/* Inner text */}
            <text x="140" y="130" textAnchor="middle" className="score-text">
              {score}
            </text>
            <text x="140" y="155" textAnchor="middle" className="score-label">
              RISK SCORE
            </text>
          </svg>
        </div>

        <div className={`risk-badge ${riskLabel.toLowerCase()}`}>
          <Shield size={20} />
          <span>{riskLabel}</span>
        </div>

        {anomalyAlert && (
          <div className="anomaly-alert">
            <AlertTriangle size={18} />
            <span>ANOMALY ALERT: ZERO-DAY BEHAVIOR DETECTED</span>
          </div>
        )}

        <div className="score-metadata">
          <div className="metadata-item">
            <TrendingUp size={14} />
            <span>Confidence: 94%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;