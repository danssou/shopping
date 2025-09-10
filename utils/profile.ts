/**
 * Generate initials from user's name
 * @param name - User's full name or first/last name
 * @returns Two-letter initials (e.g., "John Doe" -> "JD")
 */
export function generateInitials(name?: string): string {
  if (!name) return 'U'; // Default to 'U' for User if no name provided
  
  const words = name.trim().split(/\s+/);
  
  if (words.length === 1) {
    // Single name - take first two letters
    return words[0].substring(0, 2).toUpperCase();
  } else {
    // Multiple names - take first letter of first and last word
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
}

/**
 * Generate a random hex color based on user's name
 * @param name - User's name to generate consistent color
 * @returns Hex color string
 */
export function generateProfileColor(name?: string): string {
  const colors = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#EAB308', // yellow-500
    '#22C55E', // green-500
    '#10B981', // emerald-500
    '#06B6D4', // cyan-500
    '#3B82F6', // blue-500
    '#6366F1', // indigo-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#F59E0B', // amber-500
    '#84CC16', // lime-500
  ];
  
  if (!name) return colors[0];
  
  // Create consistent color based on name hash
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Get device info from user agent
 * @param userAgent - Browser user agent string
 * @returns Device information object
 */
export function parseDeviceInfo(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let type: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  if (/mobile|android|iphone|ipod/.test(ua)) {
    type = 'mobile';
  } else if (/tablet|ipad/.test(ua)) {
    type = 'tablet';
  }
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('edge')) {
    browser = 'Edge';
  } else if (ua.includes('chrome')) {
    browser = 'Chrome';
  } else if (ua.includes('safari')) {
    browser = 'Safari';
  }
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac')) {
    os = 'macOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('android')) {
    os = 'Android';
  } else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) {
    os = 'iOS';
  }
  
  return {
    type,
    browser,
    os,
    name: `${browser} on ${os}`,
  };
}
