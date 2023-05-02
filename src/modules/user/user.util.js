const getFirebasePathForCertificateUploads = (userId) => {
  return `users/${userId}/certificate`;
};

export default { getFirebasePathForCertificateUploads };
