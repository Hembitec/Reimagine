
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Converts a Base64 string to a Blob and uploads it to Firebase Storage.
 * Returns the public download URL.
 */
export const uploadBase64Image = async (
  base64String: string, 
  userId: string, 
  projectId: string, 
  fileName: string
): Promise<string> => {
  try {
    // 1. Check if it's already a URL (previously uploaded)
    if (base64String.startsWith('http')) {
      return base64String;
    }

    // 2. Remove header (data:image/jpeg;base64,)
    const base64Content = base64String.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
    
    // 3. Convert to Blob
    const byteCharacters = atob(base64Content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // 4. Create Reference (users/{uid}/{projId}/{filename})
    const storageRef = ref(storage, `users/${userId}/${projectId}/${fileName}`);

    // 5. Upload
    const snapshot = await uploadBytes(storageRef, blob);

    // 6. Get URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;

  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
