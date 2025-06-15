// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import '../Styles/Dashbord.css';
import { User, IndianRupee, ShoppingCart, Clock, TrendingUp, Eye, Bell, Search, Menu, X } from 'lucide-react';
import { OrdersTable } from '../Components/OrdersTable';
import { StatsCard } from '../Components/StatsCard';


const Dashboard: React.FC = () => {
    return (
        <div className="dashboard">

            <main className="main">
                <div className="stats-grid">
                    <StatsCard title="Today's Sales" value="₹750.50" icon={<IndianRupee size={28} />} colorClass="green" trend={12} />
                    <StatsCard title="Today's Orders" value="23" icon={<ShoppingCart size={28} />} colorClass="blue" trend={8} delay={100} />
                    <StatsCard title="Total Customers" value="1,234" icon={<User size={28} />} colorClass="purple" trend={15} delay={200} />
                    <StatsCard title="Revenue" value="₹45,750" icon={<TrendingUp size={28} />} colorClass="orange" trend={22} delay={300} />
                </div>

                <div className="orders-section fade-in-up">
                    <OrdersTable />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;