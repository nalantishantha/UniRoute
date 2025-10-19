/**
 * Utility functions for University Student API calls
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Fetch complete university student profile data
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Complete profile data including university, program, etc.
 */
export const fetchUniversityStudentProfile = async (userId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/university-students/profile/?user_id=${userId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();

        if (data.success && data.profile) {
            return {
                success: true,
                data: {
                    // Personal Information
                    fullName: data.profile.personal.name,
                    email: data.profile.personal.email,
                    phone: data.profile.personal.phone,
                    location: data.profile.personal.location,
                    bio: data.profile.personal.bio,
                    avatar: data.profile.personal.avatar,
                    joinDate: data.profile.personal.joinDate,

                    // University Information
                    university: data.profile.university.university,
                    faculty: data.profile.university.faculty,
                    degreeProgram: data.profile.university.degree_program,
                    yearOfStudy: data.profile.university.year_of_study,
                    registrationNumber: data.profile.university.registration_number,
                    gpa: data.profile.university.gpa,

                    // Additional data
                    education: data.profile.education,
                    experience: data.profile.experience,
                    socialLinks: data.profile.social_links,
                }
            };
        } else {
            return {
                success: false,
                error: data.message || 'Failed to fetch profile data'
            };
        }
    } catch (error) {
        console.error('Error fetching university student profile:', error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};

/**
 * Fetch university student by user ID (simpler version)
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} Basic university student data
 */
export const fetchUniversityStudentByUserId = async (userId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/university-students/by-user/${userId}/`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching university student:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
