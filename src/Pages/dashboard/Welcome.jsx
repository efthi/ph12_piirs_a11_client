import { FileText, Clock, CheckCircle, DollarSign, Users, UserCheck } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Welcome = () => {
  // Demo - পরে context থেকে আসবে
  
//  const {user} = useAuth();
  const user = {
    name: "John Doe",
    role: "citizen" // 'citizen' | 'staff' | 'admin'
  };

  // Role-based stats
  const getStats = (role) => {
    switch(role) {
      case 'citizen':
        return [
          { icon: FileText, label: 'Total Issues', value: '12', color: 'text-primary' },
          { icon: Clock, label: 'Pending', value: '3', color: 'text-warning' },
          { icon: CheckCircle, label: 'Resolved', value: '8', color: 'text-success' },
          { icon: DollarSign, label: 'Payments', value: '৳500', color: 'text-secondary' },
        ];
      case 'staff':
        return [
          { icon: FileText, label: 'Assigned Issues', value: '25', color: 'text-primary' },
          { icon: Clock, label: 'In Progress', value: '8', color: 'text-warning' },
          { icon: CheckCircle, label: 'Resolved', value: '15', color: 'text-success' },
          { icon: UserCheck, label: 'Today\'s Task', value: '5', color: 'text-info' },
        ];
      case 'admin':
        return [
          { icon: FileText, label: 'Total Issues', value: '247', color: 'text-primary' },
          { icon: CheckCircle, label: 'Resolved', value: '189', color: 'text-success' },
          { icon: Users, label: 'Total Users', value: '1,420', color: 'text-info' },
          { icon: DollarSign, label: 'Revenue', value: '৳45,200', color: 'text-secondary' },
        ];
      default:
        return [];
    }
  };

  const stats = getStats(user.role);

  // Role-based welcome message
  const getWelcomeMessage = (role) => {
    switch(role) {
      case 'citizen':
        return "Track and manage your reported issues";
      case 'staff':
        return "Manage assigned issues and update their status";
      case 'admin':
        return "Monitor all activities and manage the system";
      default:
        return "Welcome to your dashboard";
    }
  };

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-lg opacity-70">{getWelcomeMessage(user.role)}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stats shadow">
              <div className="stat">
                <div className={`stat-figure ${stat.color}`}>
                  <Icon size={32} />
                </div>
                <div className="stat-title">{stat.label}</div>
                <div className={`stat-value ${stat.color}`}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-based Quick Actions */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            {user.role === 'citizen' && (
              <>
                <button className="btn btn-primary">Report New Issue</button>
                <button className="btn btn-outline">View My Issues</button>
                <button className="btn btn-outline">Subscribe to Premium</button>
              </>
            )}
            {user.role === 'staff' && (
              <>
                <button className="btn btn-primary">View Assigned Issues</button>
                <button className="btn btn-outline">Update Status</button>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <button className="btn btn-primary">View All Issues</button>
                <button className="btn btn-outline">Manage Users</button>
                <button className="btn btn-outline">Add Staff</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recent Activity</h2>
          <div className="divider"></div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-primary">New</div>
              <span className="flex-1">Issue #123 has been created</span>
              <span className="text-xs opacity-60">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-success">Resolved</div>
              <span className="flex-1">Issue #120 has been resolved</span>
              <span className="text-xs opacity-60">5 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="badge badge-warning">Progress</div>
              <span className="flex-1">Issue #118 is in progress</span>
              <span className="text-xs opacity-60">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;