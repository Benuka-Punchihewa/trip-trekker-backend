const getFirebasePathForPulseRecordImageUploads = (
  attractionId: string,
  pulseRecordId: string
) => {
  return `attractions/${attractionId}/pulse-stream-data/${pulseRecordId}`;
};

export default { getFirebasePathForPulseRecordImageUploads };
