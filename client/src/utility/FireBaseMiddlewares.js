import { storage } from "./firebaseConfig.js"; // Import your storage instance

export const uploadFile = async (file) => {
  try {
    const storageRef = storage.ref(); // Reference to the root of your storage bucket
    const fileRef = storageRef.child(`uploads/${file.name}`); // Create a reference to the file path

    const uploadTask = fileRef.put(file); // Start the upload

    // Monitor upload progress (optional)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed:", error);
      },
      () => {
        // Handle successful uploads
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          return downloadURL; // Return the download URL
        });
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const deleteFile = async (fileURL) => {
  try {
    const storageRef = storage.refFromURL(fileURL); // Get a reference to the file from its URL
    await storageRef.delete(); // Delete the file
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};


export const downloadFile = async (fileURL) => {
  try {
    const storageRef = storage.refFromURL(fileURL); // Get a reference to the file from its URL
    const downloadURL = await storageRef.getDownloadURL(); // Get the download URL

    // Extract the file extension from the URL
    const fileName = fileURL.split("/").pop(); // Get the last part of the URL (filename)

    // Create a link element and trigger a click to initiate the download
    const link = document.createElement("a");
    link.href = downloadURL;
    link.setAttribute("download", fileName); // Use the original filename with extension
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    alert(`An Error occurred while download the file:\n${error}`);
  }
};

