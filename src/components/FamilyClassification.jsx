import { useState } from 'react';
import { Skull, AlertTriangle, Eye, Lock, ChevronDown, ChevronUp,Info,FileText,Network, Clock} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FamilyClassification = ({ predictions, isAnalyzing }) => {
  const [expandedFamily, setExpandedFamily] = useState(null);

  const families = [
    { 
      name: 'TROJAN', 
      risk: 'High Risk', 
      icon: Skull,
      color: '#ef4444',
      description: 'Trojan malware disguises itself as legitimate applications to trick users into installation. Once installed, it can steal banking credentials, send premium SMS messages, and download additional malicious payloads.',
      commonBehaviors: [
        'Banking credential theft',
        'Premium SMS sending',
        'Keylogging',
        'Remote access backdoors'
      ],
      detectionIndicators: [
        'Requests for SMS permissions',
        'Hidden accessibility services',
        'Obfuscated code patterns'
      ]
    },
    { 
      name: 'ADWARE', 
      risk: 'Medium Risk', 
      icon: AlertTriangle,
      color: '#f59e0b',
      description: 'Adware displays intrusive advertisements, often outside the app context. While not directly destructive, it degrades user experience, drains battery, and can collect browsing data for targeted advertising.',
      commonBehaviors: [
        'Full-screen popup ads',
        'Browser homepage hijacking',
        'Notification spam',
        'Data collection for ad targeting'
      ],
      detectionIndicators: [
        'Excessive internet permissions',
        'Suspicious ad library inclusions',
        'Background service abuse'
      ]
    },
    { 
      name: 'SPYWARE', 
      risk: 'High Risk', 
      icon: Eye,
      color: '#ec4899',
      description: 'Spyware covertly monitors user activity, capturing sensitive information including SMS messages, call logs, location data, and even recording calls. It operates stealthily without user knowledge.',
      commonBehaviors: [
        'Call recording',
        'GPS tracking',
        'Message interception',
        'Contact list exfiltration'
      ],
      detectionIndicators: [
        'Stealth mode capabilities',
        'Data exfiltration patterns',
        'Persistent background services'
      ]
    },
    { 
      name: 'RANSOMWARE', 
      risk: 'Critical Risk', 
      icon: Lock,
      color: '#dc2626',
      description: 'Ransomware encrypts user files or locks the device entirely, demanding payment (usually in cryptocurrency) for decryption. Mobile ransomware often displays fake police or government warnings.',
      commonBehaviors: [
        'File encryption',
        'Device admin abuse',
        'Fake law enforcement screens',
        'Cryptocurrency payment demands'
      ],
      detectionIndicators: [
        'File system manipulation',
        'Administrator privilege requests',
        'Unusual encryption APIs'
      ]
    }
  ];

  const toggleExpand = (familyName) => {
    setExpandedFamily(expandedFamily === familyName ? null : familyName);
  };

  return (
    <div className="family-classification">
      <div className="section-header">
        <h3 className="section-title">Malware Family Classification</h3>
        <div className="classification-badge">
          <Network size={14} />
          <span>ML Classifier: XGBoost v3.2</span>
        </div>
      </div>

      <div className="families-grid">
        {families.map((family) => {
          const Icon = family.icon;
          const percentage = predictions ? predictions[family.name] || 0 : 0;
          const isExpanded = expandedFamily === family.name;
          
          return (
            <motion.div
              key={family.name}
              className={`family-card ${isExpanded ? 'expanded' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderTopColor: family.color }}
            >
              <div className="family-header" onClick={() => toggleExpand(family.name)}>
                <div className="family-icon" style={{ background: `${family.color}20` }}>
                  <Icon size={24} color={family.color} />
                </div>
                <div className="family-info">
                  <div className="family-name-row">
                    <h4>{family.name}</h4>
                    <span className="family-risk" style={{ background: `${family.color}20`, color: family.color }}>
                      {family.risk}
                    </span>
                  </div>
                  <div className="family-probability">
                    <div className="prob-bar">
                      <div 
                        className="prob-fill"
                        style={{ 
                          width: `${percentage}%`,
                          background: `linear-gradient(90deg, ${family.color}, ${family.color}cc)`
                        }}
                      />
                    </div>
                    <span className="prob-value">{percentage}%</span>
                  </div>
                </div>
                <button className="expand-btn">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="family-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="details-content">
                      <div className="detail-section">
                        <div className="detail-title">
                          <Info size={16} />
                          <span>Description</span>
                        </div>
                        <p>{family.description}</p>
                      </div>

                      <div className="detail-section">
                        <div className="detail-title">
                          <AlertTriangle size={16} />
                          <span>Common Behaviors</span>
                        </div>
                        <div className="detail-list">
                          {family.commonBehaviors.map((behavior, i) => (
                            <span key={i} className="detail-tag behavior">{behavior}</span>
                          ))}
                        </div>
                      </div>

                      <div className="detail-section">
                        <div className="detail-title">
                          <FileText size={16} />
                          <span>Detection Indicators</span>
                        </div>
                        <div className="detail-list">
                          {family.detectionIndicators.map((indicator, i) => (
                            <span key={i} className="detail-tag indicator">{indicator}</span>
                          ))}
                        </div>
                      </div>

                      <div className="detail-footer">
                        <div className="detail-meta">
                          <Clock size={12} />
                          <span>Last updated: 2026</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {isAnalyzing && (
        <div className="analysis-loading">
          <div className="loading-spinner"></div>
          <p>Analyzing malware family patterns...</p>
        </div>
      )}
    </div>
  );
};

export default FamilyClassification;