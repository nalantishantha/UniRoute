/**
 * Download utility functions for academic resources
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Download a resource file from the backend
 * @param {number} resourceId - The ID of the resource to download
 * @param {string} filename - The filename to save as (optional)
 * @returns {Promise<boolean>} - Success status
 */
export const downloadResource = async (resourceId, filename = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/download/${resourceId}/`, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('File not found');
      } else if (response.status === 403) {
        throw new Error('Access denied');
      } else {
        throw new Error(`Download failed: ${response.status}`);
      }
    }

    // Get filename from response headers if not provided
    let downloadFilename = filename;
    if (!downloadFilename) {
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          downloadFilename = filenameMatch[1];
        }
      }
    }

    // Create blob from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename || `resource_${resourceId}`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};

/**
 * Show download progress notification (optional enhancement)
 * @param {number} resourceId - Resource ID
 * @param {Function} onProgress - Progress callback
 * @param {Function} onComplete - Completion callback
 * @param {Function} onError - Error callback
 */
export const downloadResourceWithProgress = async (resourceId, onProgress, onComplete, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}/resources/download/${resourceId}/`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const contentLength = response.headers.get('content-length');
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress && total) {
        onProgress((loaded / total) * 100);
      }
    }

    // Combine chunks
    const blob = new Blob(chunks);

    // Get filename
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `resource_${resourceId}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    if (onComplete) {
      onComplete(filename);
    }

    return true;
  } catch (error) {
    console.error('Download with progress error:', error);
    if (onError) {
      onError(error);
    }
    throw error;
  }
};

/**
 * Format file size for display
 * @param {number|string} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === '0') return '0 B';

  const size = parseInt(bytes);
  if (isNaN(size)) return bytes;

  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let fileSize = size;

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Get file type icon name based on file type
 * @param {string} fileType - MIME type or file extension
 * @returns {string} - Icon name for the file type
 */
export const getFileTypeIcon = (fileType) => {
  if (!fileType) return 'document';

  const type = fileType.toLowerCase();

  if (type.includes('pdf')) return 'pdf';
  if (type.includes('video') || type.includes('mp4') || type.includes('avi')) return 'video';
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg')) return 'image';
  if (type.includes('word') || type.includes('doc')) return 'document';
  if (type.includes('excel') || type.includes('sheet')) return 'document';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'document';
  if (type.includes('text') || type.includes('txt')) return 'document';

  return 'document';
};