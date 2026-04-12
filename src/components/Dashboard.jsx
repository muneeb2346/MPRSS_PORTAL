import React, { useState } from 'react';
import UploadArea from './UploadArea';
import RiskScore from './RiskScore';
import RiskBreakdown from './RiskBreakdown';
import LiveLog from './LiveLog';

const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
    setLogs([]);
    
    // Initial log entries
    addLog(`APK uploaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog('Extracting DEX files and resources...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('[STATIC] Analyzing manifest permissions and API calls');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Update static score
    const staticScore = Math.floor(Math.random() * 30) + 65; // 65-95
    setBreakdownScores(prev => ({ ...prev, static: staticScore }));
    addLog(`[STATIC] Permission risk score: ${staticScore}/100`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    addLog('[BEHAVIORAL] DETECTED: Suspicious crypto operations');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('[BEHAVIORAL] Running sandbox ML inference');
    const behavioralScore = Math.floor(Math.random() * 25) + 70; // 70-95
    setBreakdownScores(prev => ({ ...prev, behavioral: behavioralScore }));
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    addLog('[ANOMALY] ALERT: Obfuscated code patterns detected in DEX');
    const anomalyScore = Math.floor(Math.random() * 20) + 75; // 75-95
    setBreakdownScores(prev => ({ ...prev, anomaly: anomalyScore }));
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addLog('Running XGBoost classifier with 247 features...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addLog('[SHAP] Feature importance computed (top contributor: SMS access)');
    const mlConfidence = Math.floor(Math.random() * 15) + 85; // 85-100
    setBreakdownScores(prev => ({ ...prev, mlConfidence: mlConfidence }));
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculate final risk score (weighted average)
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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>MPRSS Analysis Portal</h1>
        <p>Malware Prediction & Risk Scoring</p>
      </div>
      
      <UploadArea onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
      
      <div className="dashboard-grid">
        <div className="grid-left">
          <RiskScore 
            score={riskData.score}
            isMalicious={riskData.isMalicious}
            anomalyAlert={riskData.anomalyAlert}
          />
          <RiskBreakdown scores={breakdownScores} />
        </div>
        <div className="grid-right">
          <LiveLog logs={logs} isActive={isAnalyzing} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;