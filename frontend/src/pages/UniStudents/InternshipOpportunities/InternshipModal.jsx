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
  Users,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Info,
  Send,
  Circle,
  User,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const InternshipModal = ({ internship, isOpen, onClose }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

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

  const hasImageUrl = internship.image_url && internship.image_url.trim() !== '';
  const shouldShowImage = hasImageUrl && !imageError;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
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
            className="absolute inset-0 bg-black bg-opacity-50"
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
              <CardContent className="p-0">
                {/* Image Banner */}
                {shouldShowImage ? (
                  <div className="relative w-full h-64 overflow-hidden">
                    <img
                      src={internship.image_url}
                      alt={internship.title || 'Internship opportunity'}
                      className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                      onLoad={() => {
                        console.log(`✅ [Modal] Image loaded: ${internship.title}`);
                        console.log(`   URL: ${internship.image_url}`);
                        setImageLoaded(true);
                        setImageError(false);
                      }}
                      onError={(e) => {
                        console.error(`❌ [Modal] Image failed: ${internship.title}`);
                        console.error(`   URL: ${internship.image_url}`);
                        setImageError(true);
                        setImageLoaded(false);
                      }}
                    />
                    {/* Loading placeholder */}
                    {!imageLoaded && !imageError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-primary-600 to-secondary">
                        <div className="w-12 h-12 border-b-2 border-white rounded-full animate-spin"></div>
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                    {/* Close Button */}
                    <button
                      onClick={onClose}
                      className="absolute z-10 p-2 transition-colors rounded-full top-4 right-4 bg-black/40 hover:bg-black/60 backdrop-blur-sm"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Status Badge */}
                    {deadlinePassed && (
                      <div className="absolute z-10 top-4 left-4">
                        <span className="px-3 py-1 text-sm font-medium text-white rounded-full shadow-lg bg-error">
                          Application Closed
                        </span>
                      </div>
                    )}

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <div className="flex items-center mb-2 space-x-2">
                        <div className="flex items-center px-2 py-1 space-x-1 text-xs rounded-full bg-primary-600/80 backdrop-blur-sm">
                          <GraduationCap className="w-3 h-3" />
                          <span>University Student Opportunity</span>
                        </div>
                      </div>
                      <h2 className="mb-2 text-3xl font-bold">{internship.title}</h2>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-5 h-5" />
                          <span className="text-lg font-medium">{internship.company?.name || 'Company'}</span>
                        </div>
                        {internship.company?.district && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{internship.company.district}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative p-6 text-white bg-gradient-to-r from-primary-600 to-secondary">
                    <button
                      onClick={onClose}
                      className="absolute p-2 transition-colors rounded-full top-4 right-4 hover:bg-white/20"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="flex items-start pr-12 space-x-4">
                      <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-xl">
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2 space-x-2">
                          <h2 className="text-2xl font-bold">{internship.title}</h2>
                          <div className="flex items-center px-2 py-1 space-x-1 text-sm rounded-full bg-white/20">
                            <GraduationCap className="w-3 h-3" />
                            <span>University Student Opportunity</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-primary-100">
                          <Building2 className="w-5 h-5" />
                          <span className="text-lg font-medium">{internship.company?.name || 'Company'}</span>
                        </div>
                        {internship.company?.district && (
                          <div className="flex items-center mt-1 space-x-2 text-primary-200">
                            <MapPin className="w-4 h-4" />
                            <span>{internship.company.district}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    {deadlinePassed && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-sm font-medium text-white rounded-full bg-error">
                          Application Closed
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto">
                  <div className="p-6 space-y-6">
                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Location */}
                      <div className="flex items-center p-4 space-x-3 rounded-lg bg-neutral-50">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-neutral-600">Location</p>
                          <p className="font-medium text-neutral-900">
                            {internship.location || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center p-4 space-x-3 rounded-lg bg-neutral-50">
                        <Calendar className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm text-neutral-600">Duration</p>
                          <p className="text-sm font-medium text-neutral-900">
                            {formatDate(internship.start_date)} - {formatDate(internship.end_date)}
                          </p>
                        </div>
                      </div>

                      {/* Stipend */}
                      <div className="flex items-center p-4 space-x-3 rounded-lg bg-neutral-50">
                        <DollarSign className="w-5 h-5 text-success" />
                        <div>
                          <p className="text-sm text-neutral-600">Stipend</p>
                          <p className="font-medium text-neutral-900">
                            {internship.stipend || 'Not specified'}
                          </p>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className="flex items-center p-4 space-x-3 rounded-lg bg-neutral-50">
                        <Clock className="w-5 h-5 text-warning" />
                        <div>
                          <p className="text-sm text-neutral-600">Deadline</p>
                          <p className="text-sm font-medium text-neutral-900">
                            {formatDate(internship.application_deadline)}
                          </p>
                          {!deadlinePassed && daysUntilDeadline !== null && (
                            <p className={`text-xs font-medium ${daysUntilDeadline <= 7 ? 'text-error' :
                              daysUntilDeadline <= 14 ? 'text-warning' : 'text-success'
                              }`}>
                              {daysUntilDeadline > 0
                                ? `${daysUntilDeadline} day${daysUntilDeadline > 1 ? 's' : ''} left`
                                : 'Today!'
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="flex items-center mb-3 text-lg font-semibold text-neutral-900">
                        <FileText className="w-5 h-5 mr-2 text-primary-600" />
                        Description
                      </h3>
                      <div className="prose prose-neutral max-w-none">
                        <p className="leading-relaxed text-neutral-700">
                          {internship.description || 'No description available for this internship.'}
                        </p>
                      </div>
                    </div>

                    {/* Requirements */}
                    {internship.requirements && (
                      <div>
                        <h3 className="flex items-center mb-3 text-lg font-semibold text-neutral-900">
                          <Award className="w-5 h-5 mr-2 text-primary-600" />
                          Requirements
                        </h3>
                        <div className="prose prose-neutral max-w-none">
                          <p className="leading-relaxed text-neutral-700">
                            {internship.requirements}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Company Information */}
                    <div>
                      <h3 className="flex items-center mb-3 text-lg font-semibold text-neutral-900">
                        <Building2 className="w-5 h-5 mr-2 text-primary-600" />
                        About {internship.company?.name || 'Company'}
                      </h3>
                      <div className="p-4 rounded-lg bg-gradient-to-r from-primary-50 to-secondary/10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <p className="mb-1 text-sm text-neutral-600">Company</p>
                            <p className="font-medium text-neutral-900">{internship.company?.name || 'Company Name'}</p>
                          </div>
                          {internship.company?.district && (
                            <div>
                              <p className="mb-1 text-sm text-neutral-600">District</p>
                              <p className="font-medium text-neutral-900">{internship.company.district}</p>
                            </div>
                          )}
                          {internship.company?.website && (
                            <div className="md:col-span-2">
                              <p className="mb-1 text-sm text-neutral-600">Website</p>
                              <a
                                href={internship.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center font-medium transition-colors text-primary-600 hover:text-primary-700"
                              >
                                {internship.company.website}
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="flex items-center mb-3 text-lg font-semibold text-neutral-900">
                        <Users className="w-5 h-5 mr-2 text-primary-600" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {internship.contact_email && (
                          <div className="flex items-center p-4 space-x-3 rounded-lg bg-primary-50">
                            <Mail className="w-5 h-5 text-primary-600" />
                            <div>
                              <p className="text-sm text-neutral-600">Email</p>
                              <a
                                href={`mailto:${internship.contact_email}`}
                                className="font-medium transition-colors text-primary-600 hover:text-primary-700"
                              >
                                {internship.contact_email}
                              </a>
                            </div>
                          </div>
                        )}

                        {internship.contact_phone && (
                          <div className="flex items-center p-4 space-x-3 rounded-lg bg-primary-50">
                            <Phone className="w-5 h-5 text-primary-600" />
                            <div>
                              <p className="text-sm text-neutral-600">Phone</p>
                              <a
                                href={`tel:${internship.contact_phone}`}
                                className="font-medium transition-colors text-primary-600 hover:text-primary-700"
                              >
                                {internship.contact_phone}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                  <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="text-sm text-neutral-600">
                      <p>🎓 This internship is suitable for university student mentors seeking practical experience</p>
                    </div>
                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={onClose}>
                        Close
                      </Button>
                      {internship.contact_email && !deadlinePassed && (
                        <Button
                          onClick={() => {
                            window.open(`mailto:${internship.contact_email}?subject=Internship Application - ${internship.title}`, '_blank');
                          }}
                          className="flex items-center space-x-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Apply Now</span>
                        </Button>
                      )}
                      {internship.company?.website && (
                        <Button
                          onClick={() => {
                            window.open(internship.company.website, '_blank');
                          }}
                          variant="outline"
                          className="flex items-center space-x-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Visit Company</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InternshipModal;
