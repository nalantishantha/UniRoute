import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Briefcase, Eye, ExternalLink, MapPin, Clock, Building2 } from "lucide-react";
import { Card, CardContent } from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { fetchInternshipOpportunities } from "../../../utils/internshipAPI";

export default function InternshipAds({ itemVariants }) {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      const response = await fetchInternshipOpportunities({ per_page: 6 });
      setInternships(response.internships || []);
    } catch (error) {
      console.error('Error loading internships:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
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

  if (loading) {
    return (
      <motion.div variants={itemVariants} className="lg:col-span-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
                Internship Opportunities
              </h3>
            </div>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="lg:col-span-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-900 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-primary-600" />
              Internship Opportunities
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/pre-mentor/internships'}
            >
              View All
            </Button>
          </div>

          {internships.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
              <p className="text-neutral-600">No internship opportunities available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internships.slice(0, 6).map((internship) => {
                const daysUntilDeadline = getDaysUntilDeadline(internship.application_deadline);
                const isDeadlineSoon = daysUntilDeadline !== null && daysUntilDeadline <= 7;
                const isExpired = daysUntilDeadline !== null && daysUntilDeadline < 0;
                const hasImageUrl = internship.image_url && internship.image_url.trim() !== '';
                const shouldShowImage = hasImageUrl && !imageErrors[internship.internship_id];

                // Debug log
                if (hasImageUrl) {
                  console.log(`[Dashboard-${internship.internship_id}] ${internship.title} - Image:`, internship.image_url);
                }

                return (
                  <motion.div
                    key={internship.internship_id}
                    className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
                    whileHover={{ y: -2 }}
                    onClick={() => window.location.href = '/pre-mentor/internships'}
                  >
                    {/* Image Header */}
                    {shouldShowImage ? (
                      <div className="relative w-full h-32 overflow-hidden bg-gradient-to-br from-primary-100 to-secondary/20">
                        <img
                          src={internship.image_url}
                          alt={internship.title || 'Internship opportunity'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onLoad={() => {
                            console.log(`✅ [Dashboard] Image loaded: ${internship.title}`);
                            console.log(`   URL: ${internship.image_url}`);
                          }}
                          onError={(e) => {
                            console.error(`❌ [Dashboard] Image failed: ${internship.title}`);
                            console.error(`   URL: ${internship.image_url}`);
                            setImageErrors(prev => ({ ...prev, [internship.internship_id]: true }));
                          }}
                        />
                        {/* Status Badge Overlay */}
                        <div className="absolute top-2 right-2">
                          {isExpired ? (
                            <span className="px-2 py-1 text-xs font-medium bg-error text-white rounded-full shadow-md whitespace-nowrap">
                              Expired
                            </span>
                          ) : isDeadlineSoon ? (
                            <span className="px-2 py-1 text-xs font-medium bg-warning text-white rounded-full shadow-md whitespace-nowrap">
                              Urgent
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-success text-white rounded-full shadow-md whitespace-nowrap">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-32 bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-white/30" />
                        {/* Status Badge Overlay */}
                        <div className="absolute top-2 right-2">
                          {isExpired ? (
                            <span className="px-2 py-1 text-xs font-medium bg-error text-white rounded-full shadow-md whitespace-nowrap">
                              Expired
                            </span>
                          ) : isDeadlineSoon ? (
                            <span className="px-2 py-1 text-xs font-medium bg-warning text-white rounded-full shadow-md whitespace-nowrap">
                              Urgent
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-success text-white rounded-full shadow-md whitespace-nowrap">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-4">
                      {/* Header */}
                      <div className="mb-3">
                        <h4 className="font-medium text-neutral-900 truncate text-sm group-hover:text-primary-600 transition-colors">
                          {internship.title}
                        </h4>
                        <div className="flex items-center space-x-1 text-xs text-neutral-600 mt-1">
                          <Building2 className="w-3 h-3" />
                          <span className="truncate">{internship.company.name}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-3">
                        {internship.location && (
                          <div className="flex items-center space-x-2 text-xs text-neutral-600">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{internship.location}</span>
                          </div>
                        )}

                        {internship.application_deadline && (
                          <div className="flex items-center space-x-2 text-xs text-neutral-600">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>Deadline: {formatDate(internship.application_deadline)}</span>
                          </div>
                        )}

                        {internship.stipend && (
                          <div className="text-xs font-medium text-success">
                            {internship.stipend}
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-600 line-clamp-2 mb-3">
                        {internship.description || 'No description available'}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs px-3 py-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = '/pre-mentor/internships';
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>

                        {internship.company.website && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs px-2 py-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(internship.company.website, '_blank');
                            }}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}