import { Activity, FileCode, Brain, BarChart3 } from 'lucide-react';

const RiskBreakdown = ({ scores }) => {
  const breakdownItems = [
    { 
      name: 'Static Score', 
      value: scores.static, 
      icon: FileCode,
      color: '#4f46e5',
      description: 'Permission & code analysis'
    },
    { 
      name: 'Behavioral Score', 
      value: scores.behavioral, 
      icon: Activity,
      color: '#8b5cf6',
      description: 'Runtime behavior analysis'
    },
    { 
      name: 'Anomaly Score', 
      value: scores.anomaly, 
      icon: Brain,
      color: '#ec4899',
      description: 'Zero-day pattern detection'
    },
    { 
      name: 'ML Confidence', 
      value: scores.mlConfidence, 
      icon: BarChart3,
      color: '#10b981',
      description: 'Model prediction confidence'
    }
  ];

  return (
    <div className="risk-breakdown">
      <h3 className="section-title">Risk Breakdown</h3>
      <div className="breakdown-grid">
        {breakdownItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="breakdown-card" style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
              <div className="breakdown-header">
                <div className="icon-wrapper" style={{ background: `${item.color}20` }}>
                  <Icon size={20} color={item.color} />
                </div>
                <span className="breakdown-name">{item.name}</span>
              </div>
              <div className="breakdown-value">{item.value}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${item.value}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)`
                  }}
                />
              </div>
              <p className="breakdown-desc">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskBreakdown;