/**
 * Utility functions for handling user profiles and images
 */

/**
 * Converts a base64 profile picture to a data URL for display
 * @param profilePic - The base64 encoded image string
 * @param contentType - The content type (e.g., "data:image/jpeg")
 * @returns Complete data URL for the image
 */
export const getProfileImageUrl = (
  profilePic?: string,
  contentType?: string
): string | null => {
  if (!profilePic || !contentType) {
    return null;
  }

  // If contentType already includes the full data URL prefix, use profilePic directly
  if (contentType.startsWith("data:")) {
    return `${contentType},${profilePic}`;
  }

  // Otherwise, construct the data URL
  return `data:${contentType};base64,${profilePic}`;
};

/**
 * Extracts initials from a full name
 * @param fullName - The full name string
 * @returns Initials (up to 2 characters)
 */
export const getInitialsFromName = (fullName: string): string => {
  const nameParts = fullName
    .trim()
    .split(" ")
    .filter((part) => part.length > 0);

  if (nameParts.length === 0) {
    return "U";
  }

  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }

  // Take first letter of first name and first letter of last name
  return `${nameParts[0].charAt(0).toUpperCase()}${nameParts[
    nameParts.length - 1
  ]
    .charAt(0)
    .toUpperCase()}`;
};

/**
 * Gets the display name, preferring employee profile over user data
 * @param employeeName - Name from employee profile
 * @param firstName - First name from user data
 * @param lastName - Last name from user data
 * @param username - Username fallback
 * @returns The best available display name
 */
export const getDisplayName = (
  employeeName?: string,
  firstName?: string,
  lastName?: string,
  username?: string
): string => {
  if (employeeName) {
    return employeeName;
  }

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  return username || "User";
};

/**
 * Gets the display role/designation, preferring employee profile designation
 * @param designation - Designation from employee profile
 * @param role - Role from user data
 * @param roleLabels - Mapping of roles to display labels
 * @returns The best available role/designation
 */
export const getDisplayRole = (
  designation?: string,
  role?: string,
  roleLabels?: Record<string, string>
): string => {
  if (designation) {
    return designation;
  }

  if (role && roleLabels) {
    return roleLabels[role] || role;
  }

  return role || "User";
};
