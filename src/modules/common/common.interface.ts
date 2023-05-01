interface IFirebaseFile {
  mimeType: string;
  firebaseStorageRef: string;
}

interface IPagination {
  page: number;
  limit: number;
  orderBy: "asc" | "desc";
}

interface IGeoJSON {
  type: String;
  coordinates: Array<number>;
}

export { IFirebaseFile, IPagination, IGeoJSON };
