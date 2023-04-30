const getFirebasePathForCertificateUploads = (userId: string) => {
  return `users/${userId}/certificate`;
};

export default { getFirebasePathForCertificateUploads };
