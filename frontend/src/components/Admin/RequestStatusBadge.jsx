import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const RequestStatusBadge = ({ status, showIcon = true, size = 'sm' }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: Clock,
      iconColor: 'text-yellow-500'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle,
      iconColor: 'text-red-500'
    },
    under_review: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: AlertCircle,
      iconColor: 'text-blue-500'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span className={`inline-flex items-center space-x-1 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={`${iconSizes[size]} ${config.iconColor}`} />}
      <span>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</span>
    </span>
  );
};

export default RequestStatusBadge;