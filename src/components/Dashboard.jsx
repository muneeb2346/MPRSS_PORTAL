import React, { useState } from 'react';
import UploadArea from './UploadArea';
import RiskScore from './RiskScore';
import RiskBreakdown from './RiskBreakdown';
import LiveLog from './LiveLog';
import FamilyClassification from './FamilyClassification';
import XaiInsights from './XaiInsights';

const API_BASE = 'http://localhost:5000';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const Dashboard = ({ isSidebarCollapsed }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysisStarted, setHasAnalysisStarted] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const [riskData, setRiskData] = useState({
    score: 0,
    isMalicious: false,
    anomalyAlert: false,
    confidence: null
  });

  // NOTE: only 'static' is a real model score right now (Module 2).
  // behavioral / anomaly / mlConfidence are null until Modules 1, 3, 6
  // are integrated — RiskBreakdown.jsx renders null as "Pending", not 0%,
  // so the dashboard never implies a real score that doesn't exist yet.
  const [breakdownScores, setBreakdownScores] = useState({
    static: 0,
    behavioral: null,
    anomaly: null,
    mlConfidence: null
  });

  const [familyPredictions, setFamilyPredictions] = useState(null);
  const [xaiFeatures, setXaiFeatures] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    setLogs(prev => [...prev, { time, message }]);
  };

  const analyzeAPK = async (file) => {
    setIsAnalyzing(true);
    setHasAnalysisStarted(true);
    setAnalysisError(null);
    setLogs([]);
    setFamilyPredictions(null);
    setXaiFeatures(null);

    addLog(`APK uploaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    await sleep(300);

    addLog('Sending APK to static analysis engine (Module 2)...');

    const formData = new FormData();
    formData.append('apk', file);

    try {
      const response = await fetch(`${API_BASE}/api/analyze/apk`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || `Server error (HTTP ${response.status})`);
      }

      const data = await response.json();

      addLog(`[STATIC] Parsed ${data.app_info.package_name} (${data.app_info.app_name})`);
      await sleep(400);

      addLog(`[STATIC] ${data.app_info.permissions_declared} permissions declared, ` +
             `${data.app_info.total_active_features} risk-relevant features matched`);
      await sleep(400);

      addLog(`[STATIC] Random Forest static risk score: ${data.static_score}/100`);
      await sleep(300);

      setBreakdownScores({
        static: data.static_score,
        behavioral: null,
        anomaly: null,
        mlConfidence: null
      });

      if (data.top_features && data.top_features.length > 0) {
        const features = data.top_features.map(f => ({
          name: f.feature,
          importance: f.importance,
          impact: 'positive',
          description: `${f.category} — contributes to the Random Forest static risk score`
        }));
        setXaiFeatures(features);
        addLog('[XAI] Top contributing static features identified');
        await sleep(300);
      }

      setRiskData({
        score: data.static_score,
        isMalicious: data.prediction === 'malicious',
        anomalyAlert: false,   // Module 3 (Anomaly Detection) not yet integrated
        confidence: data.confidence
      });

      addLog(`Classification (static only): ${data.prediction.toUpperCase()}`);
      await sleep(300);
      addLog('✅ Static analysis complete. Behavioral, anomaly, and family ' +
             'classification modules are not yet integrated — this score ' +
             'reflects static analysis only.');

    } catch (err) {
      console.error('Analysis failed:', err);
      const message = err.message.includes('Failed to fetch')
        ? 'Could not reach the analysis server. Is the Flask API running on localhost:5000?'
        : err.message;
      setAnalysisError(message);
      addLog(`❌ ERROR: ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (file) => {
    analyzeAPK(file);
  };

  const handleReset = () => {
    setHasAnalysisStarted(false);
    setAnalysisError(null);
    setLogs([]);
    setRiskData({ score: 0, isMalicious: false, anomalyAlert: false, confidence: null });
    setBreakdownScores({ static: 0, behavioral: null, anomaly: null, mlConfidence: null });
    setFamilyPredictions(null);
    setXaiFeatures(null);
  };

  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="dashboard-header">
        <h1>MPRSS Analysis Portal</h1>
        <p>Malware Prediction & Risk Scoring System</p>
      </div>

      <div className="upload-log-row">
        <div className="upload-section">
          <UploadArea onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
        </div>
        <div className="log-section">
          <LiveLog logs={logs} isActive={isAnalyzing} isAnalyzing={isAnalyzing} />
        </div>
      </div>

      {analysisError && (
        <div className="analysis-error-banner">
          <strong>Analysis failed:</strong> {analysisError}
        </div>
      )}

      {hasAnalysisStarted && (
        <>
          <div className="risk-assessment-row">
            <div className="risk-gauge-section">
              <RiskScore
                score={riskData.score}
                isMalicious={riskData.isMalicious}
                anomalyAlert={riskData.anomalyAlert}
                confidence={riskData.confidence}
              />
            </div>
            <div className="risk-breakdown-section">
              <RiskBreakdown scores={breakdownScores} />
            </div>
          </div>

          <div className="full-width-section">
            <FamilyClassification
              predictions={familyPredictions}
              isAnalyzing={isAnalyzing}
            />
          </div>

          <div className="full-width-section">
            <XaiInsights
              features={xaiFeatures}
              isAnalyzing={isAnalyzing}
              confidence={riskData.confidence}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
