import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  LogOut
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { logout } from '../../utils/auth';

export default function MentorRequestNotice({ itemVariants }) {
  const [mentorStatus, setMentorStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    checkMentorStatus();
  }, []);

  const checkMentorStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:8000/api/pre-mentors/mentor-status/?user_id=${user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMentorStatus(result);
        }
      }
    } catch (error) {
      console.error('Error checking mentor status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentor = async () => {
    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await fetch('http://localhost:8000/api/pre-mentors/request-mentor/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh status after successful submission
        await checkMentorStatus();

        // Show success message
        alert('Success! Your mentor application has been submitted and is now pending university approval.');
      } else {
        alert(result.message || 'Failed to submit mentor application');
      }
    } catch (error) {
      console.error('Error submitting mentor request:', error);
      alert('Failed to submit mentor application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoutAndRedirect = async () => {
    try {
      setSubmitting(true);
      const user = JSON.parse(localStorage.getItem('user'));

      if (user) {
        await logout(user.user_id);
        // After logout, user will be redirected to login page
        // They can then login again and will be redirected to mentor dashboard
        alert('You have been logged out. Please login again to access your mentor dashboard.');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Failed to logout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleButtonClick = () => {
    const content = getNoticeContent();
    if (content.buttonAction === 'logout') {
      handleLogoutAndRedirect();
    } else if (content.buttonAction === 'apply') {
      handleRequestMentor();
    }
  };

  // Don't show notice if loading or if they chose to hide it
  if (!showNotice || loading) {
    return null;
  }

  // Show different content based on application status
  const getNoticeContent = () => {
    if (mentorStatus?.has_applied && mentorStatus?.approved) {
      // Application approved - user is now a mentor
      return {
        title: "🎉 Congratulations! You Are Now a Mentor!",
        message: "Your mentor application has been approved by the university! To access your mentor dashboard with full mentor features, please logout and login again.",
        icon: CheckCircle,
        iconColor: "text-success",
        bgColor: "from-success/10 to-green-50",
        borderColor: "border-success/30",
        showButton: true,
        buttonText: "Logout & Login as Mentor",
        buttonAction: "logout"
      };
    } else if (mentorStatus?.has_applied && !mentorStatus?.approved) {
      // Application pending
      return {
        title: "Mentor Application Pending",
        message: "Your mentor application is currently under review by the university administration. You will be notified once your application is approved.",
        icon: Clock,
        iconColor: "text-warning",
        bgColor: "from-warning/10 to-warning/5",
        borderColor: "border-warning/20",
        showButton: false
      };
    } else {
      // Can apply
      return {
        title: "Ready to Become a Mentor?",
        message: "Take your tutoring to the next level! Apply to become a mentor and gain access to more students, advanced features, and higher earning potential.",
        icon: Star,
        iconColor: "text-secondary",
        bgColor: "from-secondary/10 to-warning/5",
        borderColor: "border-secondary/20",
        showButton: true,
        buttonText: "Apply to Become a Mentor",
        buttonAction: "apply"
      };
    }
  };

  const content = getNoticeContent();

  return (
    <AnimatePresence>
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="relative"
      >
        <Card className={`relative overflow-hidden border-2 ${content.borderColor} bg-gradient-to-r ${content.bgColor}`}>
          <CardContent className="p-6">
            {/* Close button */}
            <button
              onClick={() => setShowNotice(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-neutral-grey hover:text-neutral-black" />
            </button>

            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-white/80 to-white/60 flex items-center justify-center`}>
                <content.icon className={`w-6 h-6 ${content.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-neutral-black mb-2">
                  {content.title}
                </h3>
                <p className="text-neutral-grey mb-4 leading-relaxed">
                  {content.message}
                </p>

                {/* Benefits list for eligible users or celebration for approved users */}
                {content.showButton && content.buttonAction === 'apply' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-neutral-black font-medium">Higher Earnings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-info" />
                      <span className="text-sm text-neutral-black font-medium">More Students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="text-sm text-neutral-black font-medium">Advanced Features</span>
                    </div>
                  </div>
                )}

                {/* Celebration features for approved mentors */}
                {content.showButton && content.buttonAction === 'logout' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-neutral-black font-medium">Full Mentor Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-success" />
                      <span className="text-sm text-neutral-black font-medium">Mentor Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-neutral-black font-medium">Enhanced Features</span>
                    </div>
                  </div>
                )}

                {/* Action button */}
                {content.showButton && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleButtonClick}
                    disabled={submitting}
                    className={`font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${content.buttonAction === 'logout'
                        ? 'bg-gradient-to-r from-success to-green-600 text-white'
                        : 'bg-gradient-to-r from-secondary to-warning text-neutral-black'
                      }`}
                  >
                    {submitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>{content.buttonAction === 'logout' ? 'Logging out...' : 'Submitting...'}</span>
                      </div>
                    ) : (
                      <>
                        {content.buttonAction === 'logout' && <LogOut className="w-4 h-4" />}
                        <span>{content.buttonText}</span>
                      </>
                    )}
                  </motion.button>
                )}

                {/* Status indicator for pending applications */}
                {mentorStatus?.has_applied && !mentorStatus?.approved && (
                  <div className="flex items-center space-x-2 text-warning">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Applied on {new Date(mentorStatus.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}