const getFirebasePathForCertificateUploads = (userId) => {
  return `users/${userId}/certificate`;
};

const getFirebasePathForProfileImageUploads = (userId) => {
  return `users/${userId}/profile-image`;
};

export default {
  getFirebasePathForCertificateUploads,
  getFirebasePathForProfileImageUploads,
};
