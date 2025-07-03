import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../utils/auth';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Building2,
  UserCheck,
  UserCog,
  BookOpen,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  Shield,
  ChevronDown,
  FileText,
  Briefcase
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Updated sidebar navigation items
  const sidebarItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      category: 'main'
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: Users,
      category: 'user-management'
    },
    {
      label: 'Students',
      path: '/admin/students',
      icon: GraduationCap,
      category: 'user-management'
    },
    {
      label: 'University Students',
      path: '/admin/university-students',
      icon: School,
      category: 'user-management'
    },
    {
      label: 'Mentors',
      path: '/admin/mentors',
      icon: UserCheck,
      category: 'user-management'
    },
    {
      label: 'Tutors',
      path: '/admin/tutors',
      icon: UserCog,
      category: 'user-management'
    },
    {
      label: 'Universities',
      path: '/admin/universities',
      icon: Building2,
      category: 'institution-management'
    },
    {
      label: 'Companies',
      path: '/admin/companies',
      icon: Briefcase,
      category: 'institution-management'
    },
    {
      label: 'Programs',
      path: '/admin/programs',
      icon: BookOpen,
      category: 'academic-management'
    },
    {
      label: 'Analytics',
      path: '/admin/analytics',
      icon: BarChart3,
      category: 'insights'
    },
    {
      label: 'Reports',
      path: '/admin/reports',
      icon: FileText,
      category: 'insights'
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      category: 'system'
    }
  ];

  // Updated stats cards data
  const statsCards = [
    {
      title: 'Total Users',
      value: '4,847',
      change: '+12.3%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Students',
      value: '2,156',
      change: '+8.7%',
      changeType: 'positive',
      icon: GraduationCap,
      color: 'bg-green-500'
    },
    {
      title: 'Universities',
      value: '67',
      change: '+3',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Companies',
      value: '89',
      change: '+12',
      changeType: 'positive',
      icon: Briefcase,
      color: 'bg-orange-500'
    }
  ];

  // Updated recent activities
  const recentActivities = [
    {
      id: 1,
      user: 'Sarah Silva',
      action: 'registered as University Student',
      time: '2 minutes ago',
      type: 'registration'
    },
    {
      id: 2,
      user: 'John Mentor',
      action: 'approved as Mentor',
      time: '15 minutes ago',
      type: 'approval'
    },
    {
      id: 3,
      user: 'Google Inc.',
      action: 'registered as Company Partner',
      time: '1 hour ago',
      type: 'company'
    },
    {
      id: 4,
      user: 'University of Moratuwa',
      action: 'added new Engineering program',
      time: '2 hours ago',
      type: 'program'
    },
    {
      id: 5,
      user: 'Alex Tutor',
      action: 'created new Mathematics course',
      time: '3 hours ago',
      type: 'course'
    }
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      if (currentUser.user_type !== 'admin') {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await logout();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const categorizeItems = (items) => {
    const categories = {
      main: { label: 'Main', items: [] },
      'user-management': { label: 'User Management', items: [] },
      'institution-management': { label: 'Institution Management', items: [] },
      'academic-management': { label: 'Academic Management', items: [] },
      insights: { label: 'Insights', items: [] },
      system: { label: 'System', items: [] }
    };

    items.forEach(item => {
      if (categories[item.category]) {
        categories[item.category].items.push(item);
      }
    });

    return categories;
  };

  const categorizedItems = categorizeItems(sidebarItems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <div>
              <h1 className="font-bold text-xl text-gray-800">UniRoute</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
          {Object.entries(categorizedItems).map(([key, category]) => (
            category.items.length > 0 && (
              <div key={key}>
                <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {category.label}
                </h3>
                <div className="space-y-1">
                  {category.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isActive(item.path)
                            ? 'bg-red-50 text-red-600 border-r-2 border-red-500'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <IconComponent className="h-5 w-5 mr-3" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name || 'Admin'} {user?.last_name || 'User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.first_name}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  5
                </span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-red-100 p-2 rounded-lg">
                    <User className="h-4 w-4 text-red-600" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                      <div className="flex items-center mt-2">
                        <span className={`text-sm font-medium ${
                          card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {card.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">from last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${card.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
                  <Link to="/admin/activities" className="text-sm text-red-600 hover:text-red-700">
                    View all
                  </Link>
                </div>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/admin/users/new"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Users className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Add New User</span>
                  </Link>
                  <Link
                    to="/admin/universities/new"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Building2 className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Add University</span>
                  </Link>
                  <Link
                    to="/admin/companies/new"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Briefcase className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Add Company</span>
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <BarChart3 className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Reports</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminDashboard;