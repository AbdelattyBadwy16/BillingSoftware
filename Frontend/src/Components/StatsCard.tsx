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



export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, colorClass, trend, delay = 0 }) => {
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
    </div>
  );
};
