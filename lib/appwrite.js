import {
    Account,
    Client,
    ID,
    Avatars,
    Databases
  } from "react-native-appwrite";
  
  export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.doubleai",
    projectId: "668d5987000065d0f108",
    storageId: "668d854100041bff73b8", 
    databaseId: "668d5b2f000fcc0839d0",
    userCollectionId: "668d5b5b003301950a59",
    videoCollectionId: "668d5b8f0021f7ad37fc",
  };
  
  
// Init your React Native SDK
const client = new Client();
client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId) 
    .setPlatform(config.platform)
  ;


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
// Register User
    export async function createUser(email, password, username) {
      try {
        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        );
    
        if (!newAccount) throw Error;
    
        const avatarUrl = avatars.getInitials(username);
    
        await signIn(email, password);
    
        const newUser = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.userCollectionId,
          ID.unique(),
          {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl,
          }
        );
    
        return newUser;
      } catch (error) {
        throw new Error(error);
      }
    }
    
    export async function signIn(email, password) {
      try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
      } catch (error) {
        throw new Error(error);
      }
    }    
