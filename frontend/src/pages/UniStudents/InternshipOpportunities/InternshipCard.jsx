import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const InternshipCard = ({ internship, onViewDetails }) => {
  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if application deadline has passed
  const isDeadlinePassed = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Calculate days until deadline
  const getDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const deadlinePassed = isDeadlinePassed(internship.application_deadline);
  const daysUntilDeadline = getDaysUntilDeadline(internship.application_deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full transition-all duration-300 cursor-pointer group hover:shadow-xl hover:shadow-primary-100 border-0 bg-white">
        <CardContent className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary rounded-xl flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-200 truncate">
                  {internship.title}
                </h3>
                <div className="flex items-center space-x-1 text-sm text-neutral-600">
                  <Building2 className="w-4 h-4" />
                  <span className="truncate">{internship.company.name}</span>
                </div>
              </div>
            </div>
            {deadlinePassed && (
              <span className="px-2 py-1 text-xs font-medium bg-error/10 text-error rounded-full">
                Expired
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-600 mb-4 line-clamp-3 flex-grow">
            {internship.description || 'No description available'}
          </p>

          {/* Details Grid */}
          <div className="space-y-3 mb-6">
            {/* Location */}
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <span className="text-neutral-700 truncate">
                {internship.location || 'Location not specified'}
              </span>
            </div>

            {/* Stipend */}
            {internship.stipend && (
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-success flex-shrink-0" />
                <span className="text-success font-medium">
                  {internship.stipend}
                </span>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <span className="text-neutral-700">
                {formatDate(internship.start_date)} - {formatDate(internship.end_date)}
              </span>
            </div>

            {/* Application Deadline */}
            {internship.application_deadline && (
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-warning flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-neutral-700">
                    Deadline: {formatDate(internship.application_deadline)}
                  </span>
                  {!deadlinePassed && daysUntilDeadline !== null && (
                    <span className={`text-xs font-medium ${daysUntilDeadline <= 7 ? 'text-error' :
                        daysUntilDeadline <= 14 ? 'text-warning' : 'text-success'
                      }`}>
                      {daysUntilDeadline > 0
                        ? `${daysUntilDeadline} day${daysUntilDeadline > 1 ? 's' : ''} left`
                        : 'Deadline is today!'
                      }
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-2 mb-6">
            {internship.contact_email && (
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a
                  href={`mailto:${internship.contact_email}`}
                  className="text-primary-600 hover:text-primary-700 transition-colors truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {internship.contact_email}
                </a>
              </div>
            )}

            {internship.contact_phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                <a
                  href={`tel:${internship.contact_phone}`}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {internship.contact_phone}
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-auto">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails && onViewDetails(internship);
              }}
              className="flex-1"
              size="sm"
            >
              View Details
            </Button>

            {internship.company.website && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(internship.company.website, '_blank');
                }}
                variant="outline"
                size="sm"
                className="flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Company District Badge */}
          {internship.company.district && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <span className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded-full">
                {internship.company.district}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InternshipCard;