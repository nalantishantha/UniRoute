// API utility functions for Pre-University Courses

const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API request failed for ${endpoint}:`, error);
        throw error;
    }
};

// Course API functions
export const coursesAPI = {
    // Get all courses with optional filters
    getCourses: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.mentor_id) params.append('mentor_id', filters.mentor_id);
        if (filters.status) params.append('status', filters.status);
        if (filters.category) params.append('category', filters.category);
        if (filters.search) params.append('search', filters.search);

        const queryString = params.toString();
        const endpoint = queryString ? `/api/courses/?${queryString}` : '/api/courses/';

        return apiRequest(endpoint);
    },

    // Get single course by ID
    getCourse: async (courseId) => {
        return apiRequest(`/api/courses/${courseId}/`);
    },

    // Create new course
    createCourse: async (courseData) => {
        return apiRequest('/api/courses/', {
            method: 'POST',
            body: JSON.stringify(courseData),
        });
    },

    // Update course
    updateCourse: async (courseId, courseData) => {
        return apiRequest(`/api/courses/${courseId}/`, {
            method: 'PUT',
            body: JSON.stringify(courseData),
        });
    },

    // Delete course
    deleteCourse: async (courseId) => {
        return apiRequest(`/api/courses/${courseId}/`, {
            method: 'DELETE',
        });
    },

    // Update course status (for admins)
    updateCourseStatus: async (courseId, status, adminId = null) => {
        const data = { status };
        if (adminId) data.admin_id = adminId;

        return apiRequest(`/api/courses/${courseId}/status/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },
};

// Course videos API functions
export const videosAPI = {
    // Get videos for a course
    getCourseVideos: async (courseId) => {
        return apiRequest(`/api/courses/${courseId}/videos/`);
    },

    // Add video to course
    addCourseVideo: async (courseId, videoData) => {
        return apiRequest(`/api/courses/${courseId}/videos/`, {
            method: 'POST',
            body: JSON.stringify(videoData),
        });
    },
};

// Course resources API functions (PDFs, documents, etc.)
export const resourcesAPI = {
    // Get all resources for a course
    getCourseResources: async (courseId) => {
        return apiRequest(`/api/courses/${courseId}/resources/`);
    },

    // Add resource to course
    addCourseResource: async (courseId, resourceData) => {
        return apiRequest(`/api/courses/${courseId}/resources/`, {
            method: 'POST',
            body: JSON.stringify(resourceData),
        });
    },

    // Update resource
    updateCourseResource: async (courseId, resourceId, resourceData) => {
        return apiRequest(`/api/courses/${courseId}/resources/${resourceId}/`, {
            method: 'PUT',
            body: JSON.stringify(resourceData),
        });
    },

    // Delete resource
    deleteCourseResource: async (courseId, resourceId) => {
        return apiRequest(`/api/courses/${courseId}/resources/${resourceId}/`, {
            method: 'DELETE',
        });
    },

    // Reorder multiple resources
    reorderResources: async (courseId, resourceOrders) => {
        return apiRequest(`/api/courses/${courseId}/resources/reorder/`, {
            method: 'PUT',
            body: JSON.stringify({ resource_orders: resourceOrders }),
        });
    },
};

// Utility API functions
export const utilityAPI = {
    // Get available course categories
    getCategories: async () => {
        return apiRequest('/api/course-categories/');
    },

    // Get available course levels
    getLevels: async () => {
        return apiRequest('/api/course-levels/');
    },
};

// Cloudinary configuration and limits
export const cloudinaryConfig = {
    // Cloudinary free tier limits
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB per file
    MAX_MONTHLY_BANDWIDTH: 25 * 1024 * 1024 * 1024, // 25GB per month
    MAX_STORAGE: 25 * 1024 * 1024 * 1024, // 25GB total storage
    MAX_TRANSFORMATIONS: 25000, // 25,000 transformations per month

    // Video specific limits
    MAX_VIDEO_DURATION: 300, // 5 minutes for free tier (in seconds)
    SUPPORTED_FORMATS: ['mp4', 'mov', 'avi', 'webm', 'mkv'],

    // Validation functions
    validateFileSize: (fileSize) => {
        if (fileSize > cloudinaryConfig.MAX_FILE_SIZE) {
            return {
                valid: false,
                message: `File size (${Math.round(fileSize / 1024 / 1024)}MB) exceeds the maximum allowed size of 100MB for Cloudinary free tier.`,
            };
        }
        return { valid: true };
    },

    validateVideoDuration: (durationSeconds) => {
        if (durationSeconds > cloudinaryConfig.MAX_VIDEO_DURATION) {
            return {
                valid: false,
                message: `Video duration (${Math.round(durationSeconds / 60)} minutes) exceeds the maximum allowed duration of 5 minutes for Cloudinary free tier.`,
            };
        }
        return { valid: true };
    },

    validateFileFormat: (fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (!cloudinaryConfig.SUPPORTED_FORMATS.includes(extension)) {
            return {
                valid: false,
                message: `File format .${extension} is not supported. Supported formats: ${cloudinaryConfig.SUPPORTED_FORMATS.join(', ')}`,
            };
        }
        return { valid: true };
    },
};

// Cloudinary setup instructions
export const cloudinaryInstructions = {
    steps: [
        {
            step: 1,
            title: "Create Cloudinary Account",
            description: "Sign up for a free account at cloudinary.com",
            action: "Visit https://cloudinary.com and click 'Sign Up'"
        },
        {
            step: 2,
            title: "Get API Credentials",
            description: "Navigate to Dashboard > Settings > API Keys",
            details: [
                "Cloud Name: This will be used in your URLs",
                "API Key: Used for authentication",
                "API Secret: Used for secure operations (keep private)"
            ]
        },
        {
            step: 3,
            title: "Configure Upload Presets",
            description: "Go to Settings > Upload > Add upload preset",
            details: [
                "Create an unsigned preset for direct uploads from frontend",
                "Set folder structure (e.g., 'pre-uni-courses/videos/', 'pre-uni-courses/thumbnails/')",
                "Configure auto-tagging with course categories"
            ]
        },
        {
            step: 4,
            title: "Set Up Auto-Optimization",
            description: "Configure automatic video optimization",
            details: [
                "Enable auto video quality adjustment",
                "Set up automatic thumbnail generation",
                "Configure video format optimization (WebM, MP4 fallback)"
            ]
        },
        {
            step: 5,
            title: "Environment Configuration",
            description: "Add credentials to your environment variables",
            code: `
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_preset_name
      `
        }
    ],

    bestPractices: [
        "Use transformation URLs to resize videos/images on-the-fly",
        "Implement progressive video loading for better user experience",
        "Use auto-quality to serve appropriate quality based on connection",
        "Tag videos with course categories for better organization",
        "Use folders to organize content by course or category",
        "Enable backup storage for important content"
    ],

    urlExamples: {
        video: "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/pre-uni-courses/videos/course-1-intro.mp4",
        thumbnail: "https://res.cloudinary.com/your-cloud/image/upload/w_400,h_225,c_fill/v1234567890/pre-uni-courses/thumbnails/course-1-thumb.jpg",
        optimizedVideo: "https://res.cloudinary.com/your-cloud/video/upload/q_auto,f_auto/v1234567890/pre-uni-courses/videos/course-1-intro.mp4"
    }
};

// Cloudinary upload utilities
export const cloudinaryUpload = {
    // Upload image to Cloudinary
    uploadImage: async (file, options = {}) => {
        // Replace with your actual Cloudinary cloud name and upload preset
        const CLOUD_NAME = 'dq2wjdatm'; // Replace with your Cloudinary cloud name
        const UPLOAD_PRESET = 'ml_default'; // Using default unsigned preset for testing

        // Check if Cloudinary is configured
        if (!CLOUD_NAME) {
            throw new Error('Cloudinary not configured. Please set CLOUD_NAME in preUniCoursesAPI.js');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'uniroute/course-thumbnails');

        // Add transformation options
        if (options.width) formData.append('width', options.width);
        if (options.height) formData.append('height', options.height);
        if (options.crop) formData.append('crop', options.crop);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                public_id: data.public_id,
                width: data.width,
                height: data.height,
            };
        } catch (error) {
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        }
    },

    // Upload document/resource file to Cloudinary
    uploadResource: async (file, options = {}) => {
        const CLOUD_NAME = 'dq2wjdatm';
        const UPLOAD_PRESET = 'uni-courses-resources'; // Using default unsigned preset for testing

        // Validate file type
        const allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rar', 'jpg', 'jpeg', 'png'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (!allowedTypes.includes(fileExtension)) {
            throw new Error(`File type .${fileExtension} is not supported. Allowed types: ${allowedTypes.join(', ')}`);
        }

        // Check file size (50MB limit for resources)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            throw new Error(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds the maximum allowed size of 50MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'pre-uni-courses/resources');
        formData.append('resource_type', 'auto'); // Auto-detect resource type

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                public_id: data.public_id,
                bytes: data.bytes,
                format: data.format,
            };
        } catch (error) {
            throw new Error(`Cloudinary resource upload failed: ${error.message}`);
        }
    },

    // Upload video to Cloudinary
    uploadVideo: async (file, options = {}) => {
        const CLOUD_NAME = 'dq2wjdatm';
        const UPLOAD_PRESET = 'uni-courses-videos'; // Using default unsigned preset for testing

        // Validate video file
        const allowedVideoTypes = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        if (!allowedVideoTypes.includes(fileExtension)) {
            throw new Error(`Video type .${fileExtension} is not supported. Allowed types: ${allowedVideoTypes.join(', ')}`);
        }

        // Check file size (100MB limit for videos)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            throw new Error(`Video size (${Math.round(file.size / 1024 / 1024)}MB) exceeds the maximum allowed size of 100MB.`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'pre-uni-courses/videos/');
        formData.append('resource_type', 'video');

        // Add video-specific transformations
        if (options.quality) formData.append('quality', options.quality);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            return {
                url: data.secure_url,
                public_id: data.public_id,
                bytes: data.bytes,
                duration: data.duration,
                format: data.format,
            };
        } catch (error) {
            throw new Error(`Cloudinary video upload failed: ${error.message}`);
        }
    },
};

// Error handling utilities
export const handleAPIError = (error, defaultMessage = 'An error occurred') => {
    if (error.message) {
        return error.message;
    }
    return defaultMessage;
};

export default {
    coursesAPI,
    videosAPI,
    resourcesAPI,
    utilityAPI,
    cloudinaryConfig,
    cloudinaryInstructions,
    cloudinaryUpload,
    handleAPIError,
};