import "../styles/globals.css";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import Login from "./login";
import Loading from "../components/Loading";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setDoc(
        doc(collection(db, "users"), user.uid),
        {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastSeen: Timestamp.fromDate(new Date())
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
