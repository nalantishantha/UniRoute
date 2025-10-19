import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import {
  fetchInternshipOpportunities,
  fetchInternshipLocations,
  fetchInternshipCompanies
} from '../../../utils/internshipAPI';
import { Card, CardContent } from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import InternshipGrid from './InternshipGrid';
import InternshipModal from './InternshipModal';

const InternshipOpportunities = () => {
  const [internships, setInternships] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load internship data
  const loadInternshipData = useCallback(async (showLoading = true) => {
    if (!isOnline) {
      setError('No internet connection. Please check your network and try again.');
      setLoading(false);
      return;
    }

    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      // Fetch all data in parallel
      const [internshipsResponse, locationsData, companiesData] = await Promise.all([
        fetchInternshipOpportunities({ per_page: 100 }), // Get more items initially
        fetchInternshipLocations(),
        fetchInternshipCompanies()
      ]);

      setInternships(internshipsResponse.internships || []);
      setLocations(locationsData || []);
      setCompanies(companiesData || []);
    } catch (err) {
      console.error('Error loading internship data:', err);

      // Set user-friendly error messages
      let errorMessage = 'Failed to load internship opportunities. ';

      if (!isOnline) {
        errorMessage += 'Please check your internet connection and try again.';
      } else if (err.message.includes('404')) {
        errorMessage += 'The internship service is currently unavailable.';
      } else if (err.message.includes('500')) {
        errorMessage += 'There was a server error. Please try again later.';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage += 'Unable to connect to the server. Please check your connection.';
      } else {
        errorMessage += err.message || 'Please try again later.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  // Initial data load
  useEffect(() => {
    loadInternshipData();
  }, [loadInternshipData]);

  // Handle viewing internship details
  const handleViewDetails = (internship) => {
    setSelectedInternship(internship);
    setIsModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
  };

  // Handle refresh
  const handleRefresh = () => {
    loadInternshipData(true);
  };

  // Retry loading data
  const handleRetry = () => {
    loadInternshipData(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  // Network status indicator
  const NetworkStatus = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${isOnline
          ? 'bg-success/10 text-success'
          : 'bg-error/10 text-error'
        }`}
    >
      {isOnline ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span>
        {isOnline ? 'Connected' : 'Offline'}
      </span>
    </motion.div>
  );

  // Error state
  if (error) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Internship Opportunities</h1>
            <p className="text-neutral-600 mt-1">Browse available internships from companies</p>
          </div>
          <NetworkStatus />
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-error" />
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              Unable to Load Internships
            </h3>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button onClick={handleRetry} className="flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header with network status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Internship Opportunities</h1>
          <p className="text-neutral-600 mt-1">
            Discover exciting internship opportunities from leading companies
          </p>
        </div>
        <NetworkStatus />
      </div>

      {/* Main Content */}
      <InternshipGrid
        internships={internships}
        locations={locations}
        companies={companies}
        loading={loading}
        onViewDetails={handleViewDetails}
        onRefresh={handleRefresh}
      />

      {/* Internship Details Modal */}
      <InternshipModal
        internship={selectedInternship}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </motion.div>
  );
};

export default InternshipOpportunities;