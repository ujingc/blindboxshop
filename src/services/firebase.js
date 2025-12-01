import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, FieldPath, getDocs, query,
  orderBy, startAfter, documentId, limit, where } from "firebase/firestore"; 
import { ref, uploadBytes, getStorage, getDownloadURL, deleteObject } from "firebase/storage";
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "firebase/auth";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    const app = initializeApp(firebaseConfig);
    this.app = app;
    this.storage = getStorage(app);
    this.db = getFirestore(app, 'blindboxgoods');
    this.auth = getAuth(app);
  }

  // AUTH ACTIONS ------------

  createAccount = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    try {
      return signInWithPopup(this.auth, provider);
      // Handle successful sign-in
    } catch (error) {
      console.error("Error signing in with Google", error);
      // Handle errors here
    }
  };

  signInWithApple = async () => {
    // 1. Create an instance of the OAuthProvider for Apple
    const provider = new OAuthProvider('apple.com');

    // 2. (Optional) Request specific scopes if needed
    // For example, to request full name and email.
    // Note: Apple only shares these the first time a user signs in.
    provider.addScope('email');
    provider.addScope('name');

    // 3. (Optional) Configure language (e.g., 'en', 'es', 'fr')
    provider.setCustomParameters({
      'locale': 'en'
    });

    try {
      // 4. Use signInWithPopup with the configured Apple provider
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;

      // You can also get the Apple-specific credential information
      const credential = OAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;

      // Handle successful sign-in
      console.log("Successfully signed in with Apple:", user);
      console.log("Apple ID Token:", idToken);

    } catch (error) {
      console.error("Error signing in with Apple:", error);
      // Handle errors here.
      // Check for specific error codes, e.g., if the popup was closed.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData?.email;
      // The AuthCredential type that was used.
      const credential = OAuthProvider.credentialFromError(error);

      // If an account already exists with the same email address,
      // you can link the accounts or handle it as appropriate.
      if (errorCode === 'auth/account-exists-with-different-credential') {
        console.warn("Account exists with different credential:", email);
        // You might prompt the user to sign in with their existing method
        // or try to link accounts.
      }
    }
  };

  signInWithFacebook = () =>
    this.auth.signInWithPopup(new app.auth.FacebookAuthProvider());

  signInWithGithub = () =>
    this.auth.signInWithPopup(new app.auth.GithubAuthProvider());

  signOut = () => this.auth.signOut();

  passwordReset = (email) => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => {
    const userDocRef = doc(this.db, "users", id);
    return setDoc(userDocRef, user); 
  }
  
  getUser = (id) => { 
    const user = this.auth.currentUser;
    const userDocRef = doc(this.db, "users", id);
    return getDoc(userDocRef, user);  
  }

  passwordUpdate = (password) => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updatePassword(newPassword)
            .then(() => {
              resolve("Password updated successfully!");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    return user.reauthenticateWithCredential(cred);
  };

  updateEmail = (currentPassword, newEmail) =>
    new Promise((resolve, reject) => {
      this.reauthenticate(currentPassword)
        .then(() => {
          const user = this.auth.currentUser;
          user
            .updateEmail(newEmail)
            .then(() => {
              resolve("Email Successfully updated");
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    });

  updateProfile = (id, updates) => {
    const userDocRef = doc(this.db, "users", id);
    return updateDoc(userDocRef, updates);  
  }

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) => {
    const userDocRef = doc(this.db, "users", userId);
    return updateDoc(userDocRef, { basket: items });  
  }
  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS --------------

  getSingleProduct = (id) => {
    const productsCollectionRef = doc(this.db, "products", id);
    return getDoc(productsCollectionRef);  
  }

  getProducts = async (lastRefKey) => { // lastRefKey should ideally be a DocumentSnapshot
      try {
          const productsCollectionRef = collection(this.db, "products");
          let products = [];
          let lastKey = null;
          let total = 0; // Initialize total

          if (lastRefKey) {
              // Construct query with startAfter for pagination
              const q = query(
                  productsCollectionRef,
                  orderBy(documentId()),
                  startAfter(lastRefKey), // lastRefKey must be a DocumentSnapshot object
                  limit(12)
              );
              const snapshot = await getDocs(q); // Execute the query
              snapshot.forEach((doc) =>
                  products.push({ id: doc.id, ...doc.data() })
              );
              if (snapshot.docs.length > 0) {
                  lastKey = snapshot.docs[snapshot.docs.length - 1];
              }

              return { products, lastKey };

          } else {
              // Initial load without lastRefKey
              // Get total count (this will read all document metadata)
              const totalSnapshot = await getDocs(productsCollectionRef);
              total = totalSnapshot.size;
              // Get the first 12 products
              const q = query(
                  productsCollectionRef,
                  orderBy(documentId()),
                  limit(12)
              );
              const snapshot = await getDocs(q); // Execute the query
              snapshot.forEach((doc) =>
                  products.push({ id: doc.id, ...doc.data() })
              );
              if (snapshot.docs.length > 0) {
                  lastKey = snapshot.docs[snapshot.docs.length - 1];
              }

              return { products, lastKey, total };
          }
      } catch (e) { // Use 'any' for type-safety or define a more specific error type
          console.error("Failed to fetch products:", e);
          throw new Error(e?.message || ":( Failed to fetch products.");
      }
  }

  searchProducts = async (searchKey) => { // Added type for searchKey
    console.log('calling searchProducts from firebase instance');

    if (!this.db) {
      // Defensive check, though the arrow function should prevent this.
      console.error("Firebase db instance is not available in searchProducts.");
      throw new Error("Firestore instance not initialized.");
    }

    try {
      const productsCollectionRef = collection(this.db, "products");
      // Query for name match (prefix search)
      const searhNameQuery = query(
        productsCollectionRef, // Start with the collection reference
        orderBy("name_lower"),
        where("name_lower", ">=", searchKey.toLowerCase()), // Ensure searchKey is lowercased
        where("name_lower", "<=", `${searchKey.toLowerCase()}\uf8ff`), // Ensure searchKey is lowercased
        limit(12)
      );

      // Query for keywords match
      const searchKeywordsQuery = query(
        productsCollectionRef, // <--- IMPORTANT: Add the collection reference here
        orderBy("dateAdded", "desc"), // Assuming 'dateAdded' exists and is indexed
        where("keywords", "array-contains-any", searchKey.toLowerCase().split(" ")), // Ensure keywords are lowercased
        limit(12)
      );

      // Execute both queries in parallel for efficiency
      const [nameSnaps, keywordsSnaps] = await Promise.all([
        getDocs(searhNameQuery),
        getDocs(searchKeywordsQuery)
      ]);

      const searchedNameProducts = [];
      const searchedKeywordsProducts = [];
      let lastKey = null; // Will only store the lastKey from the name search for pagination
      if (!nameSnaps.empty) {
        nameSnaps.forEach((doc) => {
          searchedNameProducts.push({ id: doc.id, ...doc.data() });
        });
        // lastKey for name search pagination (if you want to paginate this specific result)
        lastKey = nameSnaps.docs[nameSnaps.docs.length - 1];
      }

      if (!keywordsSnaps.empty) {
        keywordsSnaps.forEach((doc) => {
          searchedKeywordsProducts.push({ id: doc.id, ...doc.data() });
        });
      }

      // MERGE PRODUCTS and remove duplicates
      const mergedProducts = [
        ...searchedNameProducts,
        ...searchedKeywordsProducts,
      ];
      const hash = {}; // Use a type for hash

      mergedProducts.forEach((product) => {
        hash[product.id] = product;
      });

      // Return the unique products and the lastKey from the name search
      return { products: Object.values(hash), lastKey };

    } catch (e) { // Explicitly type 'e' as any or Error
      console.error("Failed to search products:", e);
      throw new Error(e?.message || ":( Failed to search products.");
    }
  };

  getFeaturedProducts = async (itemsCount = 12) => {
    const productsRef = collection(this.db, "products");
    const q = query(
      productsRef,
      where("isFeatured", "==", true),
      limit(itemsCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot; // This still returns a QuerySnapshot
  };

  // 1. getRecommendedProducts (v9 style)
  getRecommendedProducts = async (itemsCount = 12) => {
    const productsRef = collection(this.db, "products");
    const q = query(
      productsRef,
      where("isRecommended", "==", true),
      limit(itemsCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  };

  // 2. addProduct (already mostly v9 style!)
  addProduct = (id, product) => {
    const productDocRef = doc(this.db, "products", id);
    return setDoc(productDocRef, product);
  };

  // 3. generateKey (v9 style - corrected for generating a new ID)
  // This generates a unique ID without creating a document yet.
  generateKey = () => {
    const productsCollectionRef = collection(this.db, "products");
    // Calling doc() without an ID argument generates a new unique ID
    return doc(productsCollectionRef).id;
  };

  // 4. storeImage (v9 style)
  storeImage = async (id, folder, imageFile) => {
    const storageRef = ref(this.storage, `${folder}/${id}`);
    const snapshot = await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  // 5. deleteImage (v9 style)
  deleteImage = (id) => {
    const storageRef = ref(this.storage, `products/${id}`);
    return deleteObject(storageRef);
  };

  // 6. editProduct (already mostly v9 style!)
  editProduct = (id, updates) => {
    const productDocRef = doc(this.db, "products", id);
    return updateDoc(productDocRef, updates);
  };

  // 7. removeProduct (already mostly v9 style!)
  removeProduct = (id) => {
    const productDocRef = doc(this.db, "products", id);
    return deleteDoc(productDocRef);
  };
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
