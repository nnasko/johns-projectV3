import React, { useState } from 'react';
import { Users, Calendar, UserCheck, UserX } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('applications');

  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users },
    { label: 'Total Events', value: '456', icon: Calendar },
    { label: 'Pending Applications', value: '23', icon: UserCheck },
  ];

  const applications = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'pending' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'pending' },
  ];

  const handleApprove = (id: number) => {
    // Handle approval logic
    console.log('Approved:', id);
  };

  const handleReject = (id: number) => {
    // Handle rejection logic
    console.log('Rejected:', id);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
              </div>
              <Icon className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Host Applications
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Manage Users
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'applications' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {application.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleApprove(application.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <UserCheck className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleReject(application.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <UserX className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-12 text-gray-500">
              User management interface would go here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}