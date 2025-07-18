import DashboardLayout from '@/layouts/DashboardLayout';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <DashboardLayout>
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-4 flex gap-4">
        <Link to="/menu" className="bg-green-600 text-white px-4 py-2 rounded">Manage Menu</Link>
        <Link to="/orders" className="bg-blue-600 text-white px-4 py-2 rounded">View Orders</Link>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Dashboard;
