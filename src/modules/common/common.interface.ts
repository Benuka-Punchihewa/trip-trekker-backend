interface IFirebaseFile {
  mimeType: string;
  firebaseStorageRef: string;
}

interface IPagination {
  page: number;
  limit: number;
  orderBy: "asc" | "desc";
}

export { IFirebaseFile, IPagination };
