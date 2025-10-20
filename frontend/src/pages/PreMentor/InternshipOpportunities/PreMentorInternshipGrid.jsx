import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Grid3X3,
  List,
  Calendar,
  DollarSign,
  ChevronDown,
  X,
  Briefcase,
} from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import PreMentorInternshipCard from './PreMentorInternshipCard';

const PreMentorInternshipGrid = ({
  internships,
  loading,
  onViewDetails,
  locations,
  companies,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort internships
  const filteredAndSortedInternships = useMemo(() => {
    let filtered = internships.filter((internship) => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLocation =
        selectedLocation === 'all' ||
        internship.location?.toLowerCase() === selectedLocation.toLowerCase();

      const matchesCompany =
        selectedCompany === 'all' ||
        internship.company.company_id.toString() === selectedCompany;

      return matchesSearch && matchesLocation && matchesCompany;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'deadline':
          const aDeadline = a.application_deadline ? new Date(a.application_deadline) : new Date('2099-12-31');
          const bDeadline = b.application_deadline ? new Date(b.application_deadline) : new Date('2099-12-31');
          return aDeadline - bDeadline;
        case 'company':
          return a.company.name.localeCompare(b.company.name);
        case 'location':
          return (a.location || 'ZZZ').localeCompare(b.location || 'ZZZ');
        default:
          return 0;
      }
    });

    return filtered;
  }, [internships, searchTerm, selectedLocation, selectedCompany, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('all');
    setSelectedCompany('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || selectedLocation !== 'all' || selectedCompany !== 'all' || sortBy !== 'newest';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 rounded-full border-primary-200 border-t-primary-600 animate-spin"></div>
          <p className="text-neutral-600">Loading internship opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Internship Opportunities</h1>
          <p className="mt-1 text-neutral-600">
            {filteredAndSortedInternships.length} internship{filteredAndSortedInternships.length !== 1 ? 's' : ''} available for pre-mentors
          </p>
        </div>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="mt-4 sm:mt-0"
        >
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-x-4 lg:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by title, description, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 transition-colors border rounded-lg border-neutral-300 focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setViewMode('grid')}
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-neutral-200 md:grid-cols-2 lg:grid-cols-4">
                  {/* Location Filter */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-neutral-700">
                      Location
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg border-neutral-300 focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option value="all">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Company Filter */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-neutral-700">
                      Company
                    </label>
                    <select
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg border-neutral-300 focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option value="all">All Companies</option>
                      {companies.map((company) => (
                        <option key={company.company_id} value={company.company_id.toString()}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-neutral-700">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg border-neutral-300 focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="deadline">Deadline (Soonest)</option>
                      <option value="company">Company Name</option>
                      <option value="location">Location</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center w-full space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear Filters</span>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Results */}
      {filteredAndSortedInternships.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <h3 className="mb-2 text-xl font-semibold text-neutral-900">
              No internship opportunities found
            </h3>
            <p className="max-w-md mx-auto mb-6 text-neutral-600">
              {hasActiveFilters
                ? "Try adjusting your search criteria or filters to see more results."
                : "There are currently no internship opportunities available. Check back later for new postings."}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }
        >
          {filteredAndSortedInternships.map((internship, index) => (
            <motion.div
              key={internship.internship_id}
              variants={itemVariants}
              custom={index}
            >
              <PreMentorInternshipCard
                internship={internship}
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default PreMentorInternshipGrid;