// API utility functions for dashboard recent activities
const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const dashboardAPI = {
  // Get recent activities for a university student
  getRecentActivities: async (universityStudentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/university-students/user/${universityStudentId}/recent-activities/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent activities');
      }

      return data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // Get dashboard statistics for a university student
  getDashboardStats: async (universityStudentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/university-students/user/${universityStudentId}/dashboard-stats/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Format time ago for display
  formatTimeAgo: (timestamp) => {
    if (!timestamp) return 'Unknown time';

    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 7) {
      return activityTime.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  },

  // Get activity icon class based on type
  getActivityIconClass: (type) => {
    const iconClasses = {
      enrollment: "bg-primary-100 text-primary-600",
      session: "bg-success/20 text-success",
      feedback: "bg-warning/20 text-yellow-600",
      payment: "bg-info/20 text-info",
      resource: "bg-purple-100 text-purple-600"
    };

    return iconClasses[type] || "bg-neutral-100 text-neutral-600";
  },

  // Get activity display title
  getActivityDisplayTitle: (activity) => {
    switch (activity.type) {
      case 'enrollment':
        return activity.title;
      case 'session':
        return activity.title;
      case 'feedback':
        return activity.title;
      case 'payment':
        return activity.title;
      case 'resource':
        return activity.title;
      default:
        return activity.title || 'Unknown Activity';
    }
  },

  // Get activity subtitle/description
  getActivitySubtitle: (activity) => {
    switch (activity.type) {
      case 'enrollment':
        return `${activity.student || 'Student'} • ${activity.time}`;
      case 'session':
        return `${activity.subject || 'Session'} • ${activity.time}`;
      case 'feedback':
        return `${activity.course || 'Course'} • ${activity.time}`;
      case 'payment':
        return `${activity.amount || 'Payment'} • ${activity.time}`;
      case 'resource':
        return `${activity.category || 'Resource'} • ${activity.time}`;
      default:
        return activity.time || 'Unknown time';
    }
  }
};