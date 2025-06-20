import React, { useState, useEffect } from 'react';
import '../Styles/Dashbord.css';
import { User, IndianRupee, ShoppingCart } from 'lucide-react';
import { OrdersTable } from '../Components/OrdersTable';
import { StatsCard } from '../Components/StatsCard';

const Dashboard: React.FC = () => {
    const [todaySales, setTodaySales] = useState<number>(0);
    const [todayOrders, setTodayOrders] = useState<number>(0);
    const [totalCustomers, setTotalCustomers] = useState<number>(0);
    useEffect(() => {
        async function Fetch() {
            let response: any = await fetch('http://localhost:8080/api/v1.0/dashbord/todaySales', {
                method: 'GET',
            });
            response = await response.json();
            setTodaySales(response);

            response = await fetch('http://localhost:8080/api/v1.0/dashbord/todayOrders', {
                method: 'GET',
            });
            response = await response.json();
            setTodayOrders(response);

            response = await fetch('http://localhost:8080/api/v1.0/dashbord/totalCustomers', {
                method: 'GET',
            });
            response = await response.json();
            setTotalCustomers(response);
        }
        Fetch();
    }, []);
    return (
        <div className="dashboard">
            <main className="main">
                <div className="stats-grid">
                    <StatsCard
                        title="Today's Sales"
                        value={`₹${todaySales.toFixed(2)}`}
                        icon={<IndianRupee size={28} />}
                        colorClass="green"
                        trend={12}
                    />
                    <StatsCard
                        title="Today's Orders"
                        value={todayOrders}
                        icon={<ShoppingCart size={28} />}
                        colorClass="blue"
                        trend={8}
                        delay={100}
                    />
                    <StatsCard
                        title="Total Customers"
                        value={totalCustomers.toLocaleString()}
                        icon={<User size={28} />}
                        colorClass="purple"
                        trend={15}
                        delay={200}
                    />
                </div>

                <div className="orders-section fade-in-up">
                    <OrdersTable />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
