import React, { useState } from 'react';
import UploadArea from './UploadArea';
import RiskScore from './RiskScore';
import RiskBreakdown from './RiskBreakdown';
import LiveLog from './LiveLog';
import FamilyClassification from './FamilyClassification';
import XaiInsights from './XaiInsights';

const Dashboard = ({ isSidebarCollapsed }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysisStarted, setHasAnalysisStarted] = useState(false); // NEW: Track if analysis started
  const [riskData, setRiskData] = useState({
    score: 0,
    isMalicious: false,
    anomalyAlert: false
  });
  const [breakdownScores, setBreakdownScores] = useState({
    static: 0,
    behavioral: 0,
    anomaly: 0,
    mlConfidence: 0
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

  const simulateAnalysis = async (file) => {
    setIsAnalyzing(true);
    setHasAnalysisStarted(true); // NEW: Show other components after analysis starts
    setLogs([]);
    setFamilyPredictions(null);
    setXaiFeatures(null);
    
    addLog(`APK uploaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog('Extracting DEX files and resources...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('[STATIC] Analyzing manifest permissions and API calls');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const staticScore = Math.floor(Math.random() * 30) + 65;
    setBreakdownScores(prev => ({ ...prev, static: staticScore }));
    addLog(`[STATIC] Permission risk score: ${staticScore}/100`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog('[BEHAVIORAL] DETECTED: Suspicious crypto operations');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('[BEHAVIORAL] Running sandbox ML inference');
    const behavioralScore = Math.floor(Math.random() * 25) + 70;
    setBreakdownScores(prev => ({ ...prev, behavioral: behavioralScore }));
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    addLog('[ANOMALY] ALERT: Obfuscated code patterns detected in DEX');
    const anomalyScore = Math.floor(Math.random() * 20) + 75;
    setBreakdownScores(prev => ({ ...prev, anomaly: anomalyScore }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('Running XGBoost classifier with 247 features...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const predictions = {
      'TROJAN': 85,
      'ADWARE': 45,
      'SPYWARE': 62,
      'RANSOMWARE': 28
    };
    setFamilyPredictions(predictions);
    addLog('[CLASSIFIER] Malware family probabilities computed');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog('[SHAP] Feature importance computed (top contributor: SMS access)');
    const mlConfidence = Math.floor(Math.random() * 15) + 85;
    setBreakdownScores(prev => ({ ...prev, mlConfidence: mlConfidence }));
    
    const features = [
      { name: 'CONTACTS_ACCESS', importance: 0.34, impact: 'positive', description: 'Access to contact list - often used by malware for propagation and data theft' },
      { name: 'READ_SMS', importance: 0.28, impact: 'positive', description: 'SMS read permission - critical for OTP interception and 2FA bypass' },
      { name: 'CAMERA_ACCESS', importance: 0.19, impact: 'positive', description: 'Camera access - can be used for surveillance and document theft' },
      { name: 'WRITE_EXTERNAL_STORAGE', importance: 0.12, impact: 'positive', description: 'Storage write - allows file encryption (ransomware) or data exfiltration' },
      { name: 'INTERNET', importance: 0.07, impact: 'positive', description: 'Internet access - enables C2 communication and data upload' }
    ];
    setXaiFeatures(features);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const finalScore = Math.floor(
      (staticScore * 0.25 + 
       behavioralScore * 0.35 + 
       anomalyScore * 0.3 + 
       mlConfidence * 0.1)
    );
    
    setRiskData({
      score: finalScore,
      isMalicious: finalScore >= 67,
      anomalyAlert: anomalyScore > 80
    });
    
    addLog(`Classification complete. Risk score computed: ${finalScore}/100`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addLog('✅ Analysis complete!');
    setIsAnalyzing(false);
  };

  const handleFileUpload = (file) => {
    simulateAnalysis(file);
  };

  // Function to reset and show only upload and log
  const handleReset = () => {
    setHasAnalysisStarted(false);
    setLogs([]);
    setRiskData({ score: 0, isMalicious: false, anomalyAlert: false });
    setBreakdownScores({ static: 0, behavioral: 0, anomaly: 0, mlConfidence: 0 });
    setFamilyPredictions(null);
    setXaiFeatures(null);
  };

  return (
    <div className={`dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="dashboard-header">
        <h1>MPRSS Analysis Portal</h1>
        <p>Malware Prediction & Risk Scoring System</p>
      </div>
      
      {/* Upload and Log Section - ALWAYS VISIBLE */}
      <div className="upload-log-row">
        <div className="upload-section">
          <UploadArea onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
        </div>
        <div className="log-section">
          <LiveLog logs={logs} isActive={isAnalyzing} isAnalyzing={isAnalyzing} />
        </div>
      </div>
      
      {/* Results Section - ONLY VISIBLE AFTER ANALYSIS STARTS */}
      {hasAnalysisStarted && (
        <>
          {/* Risk Score + Risk Breakdown Row */}
          <div className="risk-assessment-row">
            <div className="risk-gauge-section">
              <RiskScore 
                score={riskData.score}
                isMalicious={riskData.isMalicious}
                anomalyAlert={riskData.anomalyAlert}
              />
            </div>
            <div className="risk-breakdown-section">
              <RiskBreakdown scores={breakdownScores} />
            </div>
          </div>
          
          {/* Malware Family Classification */}
          <div className="full-width-section">
            <FamilyClassification 
              predictions={familyPredictions} 
              isAnalyzing={isAnalyzing}
            />
          </div>
          
          {/* XAI Insights */}
          <div className="full-width-section">
            <XaiInsights 
              features={xaiFeatures} 
              isAnalyzing={isAnalyzing}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;