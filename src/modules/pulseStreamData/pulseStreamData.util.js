const getFirebasePathForPulseRecordImageUploads = (
  attractionId,
  pulseRecordId
) => {
  return `attractions/${attractionId}/pulse-stream-data/${pulseRecordId}`;
};

export default { getFirebasePathForPulseRecordImageUploads };
