import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Mail,
  Phone,
  ExternalLink,
  Globe,
  Users,
  Info,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const InternshipModal = ({ internship, isOpen, onClose }) => {
  if (!internship) return null;

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.75,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.75,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <Card className="border-0 shadow-2xl">
              <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-secondary/10">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary rounded-xl flex items-center justify-center shadow-lg">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                        {internship.title}
                      </h2>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5 text-primary-600" />
                          <span className="text-lg font-medium text-neutral-700">
                            {internship.company.name}
                          </span>
                        </div>
                        {deadlinePassed ? (
                          <span className="px-3 py-1 text-sm font-medium bg-error/10 text-error rounded-full">
                            Application Deadline Passed
                          </span>
                        ) : internship.application_deadline && (
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${daysUntilDeadline <= 7 ? 'bg-error/10 text-error' :
                              daysUntilDeadline <= 14 ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'
                            }`}>
                            {daysUntilDeadline > 0
                              ? `${daysUntilDeadline} day${daysUntilDeadline > 1 ? 's' : ''} left`
                              : 'Deadline is today!'
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <CardContent className="p-6 space-y-8">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Location */}
                      <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-sm font-medium text-neutral-600">Location</p>
                          <p className="text-neutral-900 font-medium">
                            {internship.location || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Stipend */}
                      <div className="flex items-center space-x-3 p-4 bg-success/5 rounded-xl">
                        <DollarSign className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm font-medium text-neutral-600">Stipend</p>
                          <p className="text-success font-medium">
                            {internship.stipend || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center space-x-3 p-4 bg-primary/5 rounded-xl">
                        <Calendar className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-sm font-medium text-neutral-600">Duration</p>
                          <p className="text-neutral-900 font-medium">
                            {formatDate(internship.start_date)} - {formatDate(internship.end_date)}
                          </p>
                        </div>
                      </div>

                      {/* Application Deadline */}
                      <div className="flex items-center space-x-3 p-4 bg-warning/5 rounded-xl">
                        <Clock className="w-5 h-5 text-warning" />
                        <div>
                          <p className="text-sm font-medium text-neutral-600">Deadline</p>
                          <p className="text-neutral-900 font-medium">
                            {formatDate(internship.application_deadline)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center space-x-2">
                        <Info className="w-5 h-5 text-primary-600" />
                        <span>About This Internship</span>
                      </h3>
                      <div className="prose prose-neutral max-w-none">
                        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                          {internship.description || 'No detailed description available for this internship position.'}
                        </p>
                      </div>
                    </div>

                    {/* Company Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-primary-600" />
                        <span>About the Company</span>
                      </h3>

                      <div className="bg-gradient-to-r from-primary-50 to-secondary/10 rounded-xl p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {internship.company.description && (
                            <div className="md:col-span-2">
                              <p className="text-neutral-700 leading-relaxed">
                                {internship.company.description}
                              </p>
                            </div>
                          )}

                          {internship.company.address && (
                            <div>
                              <p className="text-sm font-medium text-neutral-600 mb-1">Address</p>
                              <p className="text-neutral-900">{internship.company.address}</p>
                            </div>
                          )}

                          {internship.company.district && (
                            <div>
                              <p className="text-sm font-medium text-neutral-600 mb-1">District</p>
                              <p className="text-neutral-900">{internship.company.district}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
                        <Users className="w-5 h-5 text-primary-600" />
                        <span>Contact Information</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Internship Contact */}
                        <Card className="border border-neutral-200">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-neutral-900 mb-3">Internship Contact</h4>
                            <div className="space-y-3">
                              {internship.contact_email && (
                                <div className="flex items-center space-x-3">
                                  <Mail className="w-4 h-4 text-primary-600" />
                                  <a
                                    href={`mailto:${internship.contact_email}`}
                                    className="text-primary-600 hover:text-primary-700 transition-colors"
                                  >
                                    {internship.contact_email}
                                  </a>
                                </div>
                              )}

                              {internship.contact_phone && (
                                <div className="flex items-center space-x-3">
                                  <Phone className="w-4 h-4 text-primary-600" />
                                  <a
                                    href={`tel:${internship.contact_phone}`}
                                    className="text-primary-600 hover:text-primary-700 transition-colors"
                                  >
                                    {internship.contact_phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Company Contact */}
                        <Card className="border border-neutral-200">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-neutral-900 mb-3">Company Contact</h4>
                            <div className="space-y-3">
                              {internship.company.contact_email && (
                                <div className="flex items-center space-x-3">
                                  <Mail className="w-4 h-4 text-primary-600" />
                                  <a
                                    href={`mailto:${internship.company.contact_email}`}
                                    className="text-primary-600 hover:text-primary-700 transition-colors"
                                  >
                                    {internship.company.contact_email}
                                  </a>
                                </div>
                              )}

                              {internship.company.contact_phone && (
                                <div className="flex items-center space-x-3">
                                  <Phone className="w-4 h-4 text-primary-600" />
                                  <a
                                    href={`tel:${internship.company.contact_phone}`}
                                    className="text-primary-600 hover:text-primary-700 transition-colors"
                                  >
                                    {internship.company.contact_phone}
                                  </a>
                                </div>
                              )}

                              {internship.company.website && (
                                <div className="flex items-center space-x-3">
                                  <Globe className="w-4 h-4 text-primary-600" />
                                  <a
                                    href={internship.company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-1"
                                  >
                                    <span>Visit Website</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="text-sm text-neutral-600">
                      Posted on {formatDate(internship.created_at)}
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                      >
                        Close
                      </Button>
                      {internship.contact_email && (
                        <Button
                          onClick={() => window.open(`mailto:${internship.contact_email}?subject=Application for ${internship.title} Internship`, '_blank')}
                          disabled={deadlinePassed}
                          size="sm"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {deadlinePassed ? 'Application Closed' : 'Send Application'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InternshipModal;