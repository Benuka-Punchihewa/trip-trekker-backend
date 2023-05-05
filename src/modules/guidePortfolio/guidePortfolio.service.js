const save = async (portfolioData, session) => {
  return portfolioData.save({ session });
};

export default { save };
