const getFirebasePathForPortfolioImageUploads = (userId, portfolioId) => {
  return `users/${userId}/portfolio/${portfolioId}`;
};

export default { getFirebasePathForPortfolioImageUploads };
