import "../styles/globals.css";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import Login from "./login";
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);
  const usersRef = collection(db, "users");

  useEffect(() => {
    if (user) {
      setDoc(
        doc(usersRef, user.uid),
        {
          email: user.email,
          lastSeen: Timestamp.fromDate(new Date()),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
