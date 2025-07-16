import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  MessageCircle,
  Save,
  RefreshCw,
  Shield,
  Ban,
  AlertCircle,
  Trash2
} from 'lucide-react';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import { getCurrentUser } from '../../../utils/auth';

const ReportDetails = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionForm, setActionForm] = useState({
    action_type: '',
    action_details: '',
    duration_days: ''
  });
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    admin_notes: ''
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-200 text-red-900'
  };

  const actionTypes = [
    { value: 'warning', label: 'Issue Warning', icon: AlertTriangle },
    { value: 'suspend', label: 'Suspend Account', icon: Ban },
    { value: 'ban', label: 'Ban Account', icon: Shield },
    { value: 'content_removed', label: 'Remove Content', icon: Trash2 },
    { value: 'no_action', label: 'No Action Required', icon: CheckCircle },
    { value: 'referred', label: 'Refer to Higher Authority', icon: AlertCircle }
  ];

  useEffect(() => {
    fetchReportDetails();
  }, [reportId]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/administration/reports/${reportId}/`);
      const data = await response.json();

      if (data.success) {
        setReport(data.report);
        setStatusUpdate({
          status: data.report.status,
          admin_notes: data.report.admin_notes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setActionLoading(true);
      const currentUser = getCurrentUser();
      
      const response = await fetch(`/api/administration/reports/${reportId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: currentUser.user_id,
          status: statusUpdate.status,
          admin_notes: statusUpdate.admin_notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchReportDetails();
        alert('Status updated successfully!');
      } else {
        alert('Failed to update status: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTakeAction = async () => {
    try {
      setActionLoading(true);
      const currentUser = getCurrentUser();
      
      const response = await fetch(`/api/administration/reports/${reportId}/action/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: currentUser.user_id,
          action_type: actionForm.action_type,
          action_details: actionForm.action_details,
          duration_days: actionForm.duration_days ? parseInt(actionForm.duration_days) : null
        })
      });

      const data = await response.json();
      
      if (data.success) {
        fetchReportDetails();
        setShowActionModal(false);
        setActionForm({ action_type: '', action_details: '', duration_days: '' });
        alert('Action taken successfully!');
      } else {
        alert('Failed to take action: ' + data.message);
      }
    } catch (error) {
      console.error('Error taking action:', error);
      alert('Failed to take action');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout pageTitle="Report Details" pageDescription="View detailed report information">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <span className="text-gray-600">Loading report details...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!report) {
    return (
      <AdminLayout pageTitle="Report Details" pageDescription="View detailed report information">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Not Found</h3>
          <p className="text-gray-600">The report you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/admin/reports')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Reports
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout pageTitle="Report Details" pageDescription="View detailed report information">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/admin/reports')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Reports</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[report.priority]}`}>
              {report.priority} Priority
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[report.status]}`}>
              {report.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{report.title}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{report.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Reporter</h3>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.reporter.username}</p>
                        <p className="text-xs text-gray-500">{report.reporter.email}</p>
                      </div>
                    </div>
                  </div>

                  {report.reported_user && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Reported User</h3>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.reported_user.username}</p>
                          <p className="text-xs text-gray-500">{report.reported_user.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                  <p className="text-gray-900">{report.category.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Created</h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{formatDate(report.created_at)}</span>
                  </div>
                </div>

                {report.evidence_files && report.evidence_files.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Evidence Files</h3>
                    <div className="space-y-2">
                      {report.evidence_files.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                            {file.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions History */}
            {report.actions && report.actions.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions History</h3>
                <div className="space-y-4">
                  {report.actions.map((action, index) => (
                    <div key={action.action_id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {action.action_type.replace('_', ' ')} by {action.admin.username}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(action.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{action.action_details}</p>
                        {action.duration_days && (
                          <p className="text-xs text-gray-500 mt-1">
                            Duration: {action.duration_days} days
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Update */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                  <textarea
                    value={statusUpdate.admin_notes}
                    onChange={(e) => setStatusUpdate(prev => ({ ...prev, admin_notes: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add notes about this report..."
                  />
                </div>

                <button
                  onClick={handleStatusUpdate}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{actionLoading ? 'Updating...' : 'Update Status'}</span>
                </button>
              </div>
            </div>

            {/* Take Action */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
              <button
                onClick={() => setShowActionModal(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Shield className="h-4 w-4" />
                <span>Take Action</span>
              </button>
            </div>

            {/* Report Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Report ID:</span>
                  <span className="text-sm text-gray-900">{report.report_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Created:</span>
                  <span className="text-sm text-gray-900">{formatDate(report.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Updated:</span>
                  <span className="text-sm text-gray-900">{formatDate(report.updated_at)}</span>
                </div>
                {report.assigned_admin && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Assigned to:</span>
                    <span className="text-sm text-gray-900">{report.assigned_admin.username}</span>
                  </div>
                )}
                {report.resolved_at && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Resolved:</span>
                    <span className="text-sm text-gray-900">{formatDate(report.resolved_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Modal */}
        {showActionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                  <select
                    value={actionForm.action_type}
                    onChange={(e) => setActionForm(prev => ({ ...prev, action_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Action</option>
                    {actionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {(actionForm.action_type === 'suspend' || actionForm.action_type === 'ban') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={actionForm.duration_days}
                      onChange={(e) => setActionForm(prev => ({ ...prev, duration_days: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter duration in days"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action Details</label>
                  <textarea
                    value={actionForm.action_details}
                    onChange={(e) => setActionForm(prev => ({ ...prev, action_details: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the action taken..."
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTakeAction}
                  disabled={!actionForm.action_type || !actionForm.action_details || actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Taking Action...' : 'Take Action'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportDetails;