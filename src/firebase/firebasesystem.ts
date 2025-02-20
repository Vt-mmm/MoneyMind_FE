// src/firebase/storage.ts

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { app } from '../firebase/config';

// Khởi tạo storage
const storage = getStorage(app);

/**
 * Upload ảnh lên Firebase Storage
 * @param file File (thường lấy từ input type="file")
 * @param folderPath Đường dẫn trong storage (vd: "images", "avatars/username", ...)
 * @returns Trả về URL của ảnh sau khi upload
 */
export async function uploadImage(file: File, folderPath: string, customName?: string): Promise<string> {
  try {
    const name = customName ? customName : file.name;

    // Tạo tham chiếu (ref) tới vị trí lưu trữ trên Storage
    const imageRef = ref(storage, `${folderPath}/${name}`);

    // Thực hiện upload
    const snapshot = await uploadBytes(imageRef, file);

    // Lấy URL download
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
}

/**
 * Lấy danh sách tất cả ảnh từ 1 folder trên Firebase Storage
 * @param folderPath Đường dẫn folder (vd: "images")
 * @returns Trả về mảng các URL ảnh
 */
export async function listImages(folderPath: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, folderPath);

    // Lấy toàn bộ items trong folder
    const res = await listAll(folderRef);

    // Duyệt qua từng item để lấy URL
    const urlPromises = res.items.map((itemRef) => getDownloadURL(itemRef));
    const urls = await Promise.all(urlPromises);

    return urls;
  } catch (error) {
    console.error("Lỗi lấy danh sách ảnh:", error);
    throw error;
  }
}

/**
 * Xóa ảnh trong Firebase Storage
 * @param imageUrl URL đầy đủ của ảnh trên Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Từ URL, tạo ref tương ứng
    // (đôi khi cần tách đường dẫn ra để ref, hoặc có thể dùng cách parse URL)
    // Ở đây minh họa cách parse nhanh, nhưng tốt nhất nên lưu lại đường dẫn gốc khi upload
    // Ví dụ: "folderPath/tenFile" để dễ quản lý
    const baseStorageUrl = "https://firebasestorage.googleapis.com/v0/b/";
    if (!imageUrl.includes(baseStorageUrl)) {
      throw new Error("URL không đúng định dạng Firebase Storage");
    }

    // Tách lấy segment đường dẫn sau bucket
    const bucketPathIndex = imageUrl.indexOf(baseStorageUrl) + baseStorageUrl.length;
    const nextSlashIndex = imageUrl.indexOf("/", bucketPathIndex); // Sau khi hết phần bucket
    if (nextSlashIndex === -1) {
      throw new Error("Không thể tách được đường dẫn object từ URL");
    }

    // Ví dụ:  moneymind-972f5.appspot.com/o/images%2Fmyavatar.jpg?...
    const fullPath = imageUrl.substring(nextSlashIndex + 1).replace("o/", "").split("?")[0];
    // Thay %2F bằng /
    const decodedPath = decodeURIComponent(fullPath);

    // Tạo reference tới file muốn xóa
    const imageRef = ref(storage, decodedPath);

    // Xóa file
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Lỗi xóa ảnh:", error);
    throw error;
  }
}
