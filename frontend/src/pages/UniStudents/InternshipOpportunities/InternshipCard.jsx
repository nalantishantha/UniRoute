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
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

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

  // Check if we should show image - simpler logic
  const hasImageUrl = internship.image_url && internship.image_url.trim() !== '';
  const shouldShowImage = hasImageUrl && !imageError;

  // Reset image state when image URL changes
  React.useEffect(() => {
    if (hasImageUrl) {
      console.log(`[${internship.internship_id}] ${internship.title} - Image URL:`, internship.image_url);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [internship.image_url, internship.internship_id, internship.title, hasImageUrl]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full overflow-hidden transition-all duration-300 bg-white border-0 cursor-pointer group hover:shadow-xl hover:shadow-primary-100">
        <CardContent className="flex flex-col h-full p-0">
          {/* Image Header */}
          {shouldShowImage ? (
            <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary/20">
              <img
                src={internship.image_url}
                alt={internship.title || 'Internship opportunity'}
                className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100 group-hover:scale-105' : 'opacity-0'
                  }`}
                onLoad={(e) => {
                  console.log(`✅ Image loaded successfully for: ${internship.title}`);
                  console.log(`   URL: ${internship.image_url}`);
                  setImageLoaded(true);
                  setImageError(false);
                }}
                onError={(e) => {
                  console.error(`❌ Image failed to load for: ${internship.title}`);
                  console.error(`   URL: ${internship.image_url}`);
                  console.error(`   Error details:`, e.type, e.target.src);
                  setImageError(true);
                  setImageLoaded(false);
                }}
                loading="lazy"
              />
              {/* Loading placeholder */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary/20">
                  <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
                </div>
              )}
              {/* Overlay Badges */}
              <div className="absolute z-10 flex flex-col items-end space-y-2 top-3 right-3">
                {deadlinePassed && (
                  <span className="px-2 py-1 text-xs font-medium text-white rounded-full shadow-md bg-error">
                    Expired
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-full h-48 bg-gradient-to-br from-primary-500 to-secondary">
              <Briefcase className="w-16 h-16 text-white/30" />
              {/* Overlay Badges for no-image case */}
              <div className="absolute flex flex-col items-end space-y-2 top-3 right-3">
                {deadlinePassed && (
                  <span className="px-2 py-1 text-xs font-medium text-white rounded-full shadow-md bg-error">
                    Expired
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="flex flex-col flex-grow p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="mb-1 text-lg font-bold transition-colors duration-200 text-neutral-900 group-hover:text-primary-600">
                {internship.title}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-neutral-600">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{internship.company.name}</span>
              </div>
            </div>

            {/* Description */}
            <p className="flex-grow mb-4 text-sm text-neutral-600 line-clamp-3">
              {internship.description || 'No description available'}
            </p>

            {/* Details Grid */}
            <div className="mb-6 space-y-3">
              {/* Location */}
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="flex-shrink-0 w-4 h-4 text-neutral-400" />
                <span className="truncate text-neutral-700">
                  {internship.location || 'Location not specified'}
                </span>
              </div>

              {/* Stipend */}
              {internship.stipend && (
                <div className="flex items-center space-x-2 text-sm">
                  <DollarSign className="flex-shrink-0 w-4 h-4 text-success" />
                  <span className="font-medium text-success">
                    {internship.stipend}
                  </span>
                </div>
              )}

              {/* Duration */}
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="flex-shrink-0 w-4 h-4 text-neutral-400" />
                <span className="text-neutral-700">
                  {formatDate(internship.start_date)} - {formatDate(internship.end_date)}
                </span>
              </div>

              {/* Application Deadline */}
              {internship.application_deadline && (
                <div className="flex items-center space-x-2 text-sm">
                  <Clock className="flex-shrink-0 w-4 h-4 text-warning" />
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
            <div className="mb-6 space-y-2">
              {internship.contact_email && (
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="flex-shrink-0 w-4 h-4 text-primary-500" />
                  <a
                    href={`mailto:${internship.contact_email}`}
                    className="truncate transition-colors text-primary-600 hover:text-primary-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {internship.contact_email}
                  </a>
                </div>
              )}

              {internship.contact_phone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="flex-shrink-0 w-4 h-4 text-primary-500" />
                  <a
                    href={`tel:${internship.contact_phone}`}
                    className="transition-colors text-primary-600 hover:text-primary-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {internship.contact_phone}
                  </a>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex mt-auto space-x-3">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Button clicked for internship:', internship.title);
                  console.log('onViewDetails function exists:', !!onViewDetails);
                  onViewDetails && onViewDetails(internship);
                }}
                className="flex-1"
                size="sm"
                disabled={deadlinePassed}
              >
                {deadlinePassed ? 'Expired' : 'View Details'}
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
              <div className="pt-3 mt-3 border-t border-neutral-100">
                <span className="px-2 py-1 text-xs rounded-full text-neutral-500 bg-neutral-50">
                  {internship.company.district}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InternshipCard;