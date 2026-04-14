import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `${path}/${fileName}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
