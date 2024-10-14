import React from 'react';
import OrderRevenueChart from '../../component/orderRevenueChart/index';
import WeeklySalesPieChart from '../../component/weeklySalesPieChart/index';
import Header from '../../component/header';
import Tagbar from '../../component/tagbar';
import Footer from '../../component/footer';
import './dashboard.css';

const Dashboard = () => {
    return (
        <>
            <Header />
            <Tagbar />
            <div className="container mt-4">
                <h1 className="text-center">Business Dashboard</h1>
                <div className="row mt-5">
                    {/* Biểu đồ đường */}
                    <div className="col-md-8 mb-4">
                        <div className="chart-box p-3">
                            <OrderRevenueChart />
                        </div>
                    </div>

                    {/* Biểu đồ hình tròn */}
                    <div className="col-md-4 mb-4">
                        <div className="chart-box p-3">
                            <WeeklySalesPieChart />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
};

export default Dashboard;
