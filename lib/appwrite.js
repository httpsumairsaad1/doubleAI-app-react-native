import {
    Account,
    Client,
    ID,
    Avatars,
    Databases,
    Query, Storage
  } from "react-native-appwrite";
  
  export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.doubleai",
    projectId: "6693e902000b4d927734", // ok 
    databaseId: "6693e9be003d3080736e",
    userCollectionId: "6693ea010013c65f5ca3",
    videoCollectionId: "6693ea4100086579d691",
    storageId: "6693ecdc000c4b3b0601", 
  };

  const {
    endpoint,
    platform,
    projectId, // ok 
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
  } = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.  


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try{
    const newAccount = await account.create(
      ID.unique(),
      email, 
      password, 
      username
    )
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    //new User
    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;

  } catch (error) {
    console.log(error)
    throw new Error(error);
  }
}

    
export const signIn = async (email, password) => {
      try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
      } catch (error) {
        throw new Error(error);
      }
}  

  export const getCurrentUser = async () => {
        try {
          const currentAccount = await account.get();
          if (!currentAccount) throw Error;
      
          const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
          );
      
          if (!currentUser) throw Error;
          return currentUser.documents[0];
        } catch (error) {
          console.log(error);
          // return null;
        }
  }

export const getAllPosts = async () => {
      try {
        const posts = await databases.listDocuments(
          databaseId,
          videoCollectionId
        );
     
        return posts.documents;
      } catch (error) {
        throw new Error(error);
      }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc('$createdAt')]
    );
 
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search('title', query)]
    );
 
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal('creator', userId), Query.orderDesc('$createdAt')]
    );
 
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video linked with Upload File
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}

// Upload File linked with Get file preview
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  }

  // console.log('FILE', file)
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    // console.log('uploaded', uploadedFile)
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
     
   } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}
