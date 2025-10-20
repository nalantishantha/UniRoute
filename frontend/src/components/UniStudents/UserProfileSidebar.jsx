import React, { useEffect, useState } from 'react';
import { fetchUniversityStudentProfile } from '../../utils/universityStudentApi';
import Button from '../../components/ui/Button';

const UserProfileSidebar = ({ userId, isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      setLoading(true);
      fetchUniversityStudentProfile(userId).then((res) => {
        if (res.success) setProfile(res.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isOpen, userId]);

  const toggleBlock = async () => {
    try {
      const me = JSON.parse(localStorage.getItem('currentUser'))?.user_id;
      if (!me) return;
      const endpoint = blocked ? '/api/communications/unblock/' : '/api/communications/block/';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ me, target: userId }),
      });
      const data = await res.json();
      if (data.success) setBlocked(!blocked);
    } catch (err) {
      console.error('block/unblock failed', err);
    }
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">User details</h3>
          <button onClick={onClose} className="text-sm text-gray-600">Close</button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          {loading ? (
            <div>Loading...</div>
          ) : profile ? (
            <div>
              <div className="flex flex-col items-center text-center">
                <img src={profile.avatar} alt={profile.fullName} className="w-28 h-28 rounded-full object-cover mx-auto mb-3" />
                <div className="font-medium text-lg">{profile.fullName}</div>
                <div className="text-sm text-gray-600">{profile.email}</div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700">About</h4>
                <p className="text-sm text-gray-600 mt-2">{profile.bio || 'No bio available'}</p>
              </div>

              <div className="mt-6">
                <Button onClick={toggleBlock} className="w-full" variant={blocked ? 'secondary' : 'danger'}>
                  {blocked ? 'Unblock user' : 'Block user'}
                </Button>
              </div>
            </div>
          ) : (
            <div>No profile found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSidebar;
