import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  trend?: number;
  delay?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  colorClass, 
  trend, 
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`stats-card ${isVisible ? 'fade-in-up' : 'hidden'}`}>
      <div className="stats-content">
        <div className="stats-text">
          <p className="stats-title">{title}</p>
          <p className="stats-value">{value}</p>
          {trend && (
            <div className="stats-trend">
              <TrendingUp size={16} />
              <span>+{trend}%</span>
              <span className="trend-note">vs last month</span>
            </div>
          )}
        </div>
        <div className={`stats-icon ${colorClass}`}>{icon}</div>
      </div>
      
      <style>{`
        .stats-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 20px;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.5s ease;
        }
        
        .stats-card.fade-in-up {
          opacity: 1;
          transform: translateY(0);
        }
        
        .stats-content {
          display: flex;
          justify-content: space-between;
        }
        
        .stats-text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .stats-title {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }
        
        .stats-value {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
        
        .stats-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #10b981;
        }
        
        .stats-trend span {
          font-weight: 500;
        }
        
        .trend-note {
          color: #9ca3af;
          font-size: 12px;
        }
        
        .stats-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stats-icon.green {
          background: #dcfce7;
          color: #166534;
        }
        
        .stats-icon.blue {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .stats-icon.purple {
          background: #ede9fe;
          color: #5b21b6;
        }
        
        .stats-icon.orange {
          background: #ffedd5;
          color: #9a3412;
        }
      `}</style>
    </div>
  );
};