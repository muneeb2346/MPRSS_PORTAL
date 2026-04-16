import { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown, 
  Info,
  ChevronRight,
  BarChart3,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const XaiInsights = ({ features, isAnalyzing }) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const defaultFeatures = [
    { name: 'CONTACTS_ACCESS', importance: 0.34, impact: 'positive', description: 'Access to contact list - often used by malware for propagation and data theft' },
    { name: 'READ_SMS', importance: 0.28, impact: 'positive', description: 'SMS read permission - critical for OTP interception and 2FA bypass' },
    { name: 'CAMERA_ACCESS', importance: 0.19, impact: 'positive', description: 'Camera access - can be used for surveillance and document theft' },
    { name: 'WRITE_EXTERNAL_STORAGE', importance: 0.12, impact: 'positive', description: 'Storage write - allows file encryption (ransomware) or data exfiltration' },
    { name: 'INTERNET', importance: 0.07, impact: 'positive', description: 'Internet access - enables C2 communication and data upload' }
  ];

  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;
  const totalImportance = displayFeatures.reduce((sum, f) => sum + f.importance, 0);
  const topFeature = displayFeatures[0];

  return (
    <div className="xai-insights">
      <div className="xai-header">
        <div className="xai-title">
          <Lightbulb size={40} color="#f59e0b" />
          <h3>XAI Insights</h3>
          <span className="xai-badge">SHAP Values</span>
        </div>
        <button 
          className="info-btn"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          <Info size={22} />
          <span>How it works</span>
        </button>
      </div>

      {showExplanation && (
        <motion.div 
          className="xai-explanation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Shield size={28} />
          <p>
            SHAP (SHapley Additive exPlanations) values show how each feature contributes to the final risk score. 
            Positive impact means the feature increases risk. Values are normalized to sum to 1.
          </p>
        </motion.div>
      )}

      <div className="xai-summary">
        <div className="summary-item">
          <BarChart3 size={26} />
          <span>Top contributor:</span>
          <strong>{topFeature.name}</strong>
          <span className="summary-value">({(topFeature.importance * 100).toFixed(0)}% impact)</span>
        </div>
        <div className="summary-item">
          <TrendingUp size={26} />
          <span>Model confidence:</span>
          <strong>94%</strong>
        </div>
      </div>

      <div className="features-list">
        <div className="features-header">
          <span>Feature</span>
          <span>Importance Score</span>
          <span>Impact</span>
        </div>
        
        {displayFeatures.map((feature, index) => (
          <motion.div
            key={feature.name}
            className="feature-row"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="feature-info">
              <div className="feature-name">
                <span className="feature-rank">#{index + 1}</span>
                <strong>{feature.name}</strong>
              </div>
              <p className="feature-desc">{feature.description}</p>
            </div>
            
            <div className="feature-importance">
              <div className="importance-bar-container">
                <div 
                  className="importance-bar"
                  style={{ 
                    width: `${feature.importance * 100}%`,
                    background: feature.impact === 'positive' 
                      ? 'linear-gradient(90deg, #ef4444, #f97316)'
                      : 'linear-gradient(90deg, #10b981, #34d399)'
                  }}
                />
              </div>
              <span className="importance-value">
                {(feature.importance * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className={`feature-impact ${feature.impact}`}>
              {feature.impact === 'positive' ? (
                <TrendingUp size={22} />
              ) : (
                <TrendingDown size={22} />
              )}
              <span>{feature.impact === 'positive' ? 'Risk+ ' : 'Risk-'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="shap-footer">
        <div className="shap-preview">
          <div className="shap-scale">
            <span className="shap-low">Lower Risk</span>
            <div className="shap-bar-container">
              <div className="shap-bar shap-negative" style={{ width: '15%' }} />
              <div className="shap-bar shap-positive" style={{ width: '85%' }} />
            </div>
            <span className="shap-high">Higher Risk</span>
          </div>
          <p className="shap-note">
            Force plot visualization available in full report
          </p>
        </div>
      </div>

      {isAnalyzing && (
        <div className="xai-loading">
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p>Computing SHAP values...</p>
        </div>
      )}
    </div>
  );
};

export default XaiInsights;