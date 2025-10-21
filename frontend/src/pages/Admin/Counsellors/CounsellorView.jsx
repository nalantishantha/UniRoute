import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../../components/common/Admin/AdminLayout';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShieldOff,
  UserCircle
} from 'lucide-react';
import { counsellorsAPI } from '../../../utils/counsellorsAPI';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const CounsellorView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [counsellor, setCounsellor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCounsellor = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await counsellorsAPI.getCounsellorById(id);
        if (!isMounted) {
          return;
        }
        setCounsellor(data.counsellor);
        setSessions(data.sessions || []);
        setFeedback(data.feedback || []);
        setRequests(data.requests || []);
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'Failed to load counsellor.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCounsellor();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <AdminLayout pageTitle="Counsellor Details">
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-12 flex flex-col items-center gap-3 text-[#6B7A8C]">
          <Loader2 className="h-8 w-8 animate-spin text-[#1D5D9B]" />
          <p>Loading counsellor...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error || !counsellor) {
    return (
      <AdminLayout pageTitle="Counsellor Details">
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-8 text-center">
          <p className="text-[#6B7A8C]">{error || `We could not find a counsellor with ID ${id}.`}</p>
          <button
            onClick={() => navigate('/admin/counsellors')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      pageTitle="Counsellor Profile"
      pageDescription="Review counsellor performance, contact info and verification status."
    >
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full border border-[#C1DBF4] text-[#1D5D9B] hover:bg-[#E8F1FF]"
                title="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-[#E8F1FF] text-[#1D5D9B] flex items-center justify-center">
                    <UserCircle className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-semibold text-[#0F172A]">
                        {counsellor.fullName || counsellor.username || 'Counsellor'}
                      </h1>
                      {counsellor.verified ? (
                        <ShieldCheck className="h-5 w-5 text-[#1B7A3D]" title="Verified counsellor" />
                      ) : (
                        <ShieldOff className="h-5 w-5 text-[#B3261E]" title="Verification pending" />
                      )}
                    </div>
                    <p className="text-sm text-[#6B7A8C]">Joined {formatDate(counsellor.joinedDate)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#6B7A8C]">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {counsellor.email || 'Not provided'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {counsellor.phone || 'Not provided'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {counsellor.location || 'Not specified'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 text-sm text-[#6B7A8C]">
              <span>Status: {counsellor.status === 'active' ? 'Active' : 'Inactive'}</span>
              <span>Last active: {formatDate(counsellor.lastActive)}</span>
            </div>
          </div>
          <div className="mt-6 text-sm text-[#4B5563] leading-relaxed">
            {counsellor.bio || 'No biography available.'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
            <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Impact Metrics</h2>
            <div className="space-y-3 text-sm text-[#4B5563]">
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {Number(counsellor.studentsSupported || 0).toLocaleString()}
                </p>
                <p className="text-xs text-[#6B7A8C]">Students supported</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {Number(counsellor.sessionsCompleted || 0).toLocaleString()}
                </p>
                <p className="text-xs text-[#6B7A8C]">Sessions completed</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E6F4EA] text-[#1B7A3D] rounded-full text-xs font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Average rating {Number(counsellor.averageRating || 0).toFixed(1)}/5
              </div>
              <p className="text-xs text-[#6B7A8C]">
                Typical response time: {counsellor.responseTime || 'Not tracked'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
            <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {(counsellor.specializations || []).length ? (
                counsellor.specializations.map((item) => (
                <span
                  key={item}
                  className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-[#E8F1FF] text-[#1D5D9B]"
                >
                  {item}
                </span>
                ))
              ) : (
                <span className="text-xs text-[#6B7A8C]">No specializations listed.</span>
              )}
            </div>
            <div className="mt-5 text-sm text-[#4B5563] space-y-2">
              <p>
                <span className="font-medium text-[#0F172A]">Languages:</span> {(counsellor.languages || []).join(', ') || 'Not specified'}
              </p>
              <p>
                <span className="font-medium text-[#0F172A]">Experience:</span> {counsellor.experienceYears || 0}+ years
              </p>
              <p className="flex items-center gap-2 text-[#6B7A8C] text-xs">
                <CalendarDays className="h-3.5 w-3.5" /> Last active {formatDate(counsellor.lastActive)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
            <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Credentials</h2>
            <div className="text-sm text-[#4B5563] space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Education</p>
                <p className="mt-1">{counsellor.education || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-[#94A3B8]">Certifications</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {(counsellor.certifications || ['Not specified']).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 text-xs text-[#6B7A8C]">
              Verification status: {counsellor.verified ? 'Completed' : 'Pending documents'}
            </div>
          </div>
        </div>

        {(sessions.length > 0 || requests.length > 0 || feedback.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
              <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Recent Sessions</h2>
              {sessions.length === 0 ? (
                <p className="text-xs text-[#6B7A8C]">No sessions recorded.</p>
              ) : (
                <ul className="space-y-3 text-xs text-[#4B5563]">
                  {sessions.slice(0, 5).map((session) => (
                    <li key={session.sessionId} className="border border-[#E7F3FB] rounded-lg p-3">
                      <p className="font-medium text-[#0F172A]">{session.topic || 'Counselling Session'}</p>
                      <p>Status: {session.status || 'Unknown'}</p>
                      <p>Scheduled: {formatDate(session.scheduledAt)}</p>
                      <p>Duration: {session.durationMinutes || 0} minutes</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
              <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Recent Requests</h2>
              {requests.length === 0 ? (
                <p className="text-xs text-[#6B7A8C]">No requests available.</p>
              ) : (
                <ul className="space-y-3 text-xs text-[#4B5563]">
                  {requests.slice(0, 5).map((request) => (
                    <li key={request.requestId} className="border border-[#E7F3FB] rounded-lg p-3">
                      <p className="font-medium text-[#0F172A]">{request.topic || 'Guidance Request'}</p>
                      <p>Status: {request.status || 'Unknown'}</p>
                      <p>Preferred Time: {request.preferredTime || 'Not specified'}</p>
                      <p>Urgency: {request.urgency || 'Not specified'}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#E7F3FB] p-6">
              <h2 className="text-sm font-semibold text-[#0F172A] mb-3">Latest Feedback</h2>
              {feedback.length === 0 ? (
                <p className="text-xs text-[#6B7A8C]">No feedback submitted yet.</p>
              ) : (
                <ul className="space-y-3 text-xs text-[#4B5563]">
                  {feedback.slice(0, 5).map((item) => (
                    <li key={item.feedbackId} className="border border-[#E7F3FB] rounded-lg p-3">
                      <p className="font-medium text-[#0F172A]">Rating {item.rating || '-'} / 5</p>
                      <p>{item.feedback || 'No comments provided.'}</p>
                      <p className="text-[#6B7A8C] mt-1">{formatDate(item.submittedAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            to={`/admin/counsellors/${counsellor.id}/edit`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#C1DBF4] text-[#0F172A] rounded-lg hover:bg-[#F8FAFC]"
          >
            Edit Profile
          </Link>
          <button
            onClick={() => navigate('/admin/counsellors')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1D5D9B] text-white rounded-lg hover:bg-[#174A7C]"
          >
            Back to List
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CounsellorView;
