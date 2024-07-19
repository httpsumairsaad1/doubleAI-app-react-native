import {
    Account,
    Client,
    ID,
    Avatars,
    Databases,
    Query
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
// Register User
    // export async function createUser(email, password, username) {
    //   try {
    //     const newAccount = await account.create(
    //       ID.unique(),
    //       email,
    //       password,
    //       username
    //     );
    
    //     if (!newAccount) throw Error;
    
    //     const avatarUrl = avatars.getInitials(username);
    
    //     await signIn(email, password);
    
    //     const newUser = await databases.createDocument(
    //       config.databaseId,
    //       config.userCollectionId,
    //       ID.unique(),
    //       {
    //         accountId: newAccount.$id,
    //         email,
    //         username,
    //         avatar: avatarUrl,
    //       }
    //     );
    
    //     return newUser;
    //   } catch (error) {
    //     throw new Error(error);
    //   }
    // }
    
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
      [Query.orderDesc('$createdAt', Query.limit(7))]
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
