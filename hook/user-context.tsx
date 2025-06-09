"use client";

import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "@firebase/auth";

type UserContextData = {
  user: FirebaseUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const UserContext = createContext<UserContextData | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

// 認証が不要なパスのリスト
const publicPaths = ["/login"];

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsubscribe();
  }, [initializing]);

  // 認証ガード
  useEffect(() => {
    if (!loading && !initializing) {
      const isPublicPath = publicPaths.some((path) =>
        pathname?.startsWith(path)
      );

      if (!user && !isPublicPath) {
        router.push("/login");
      } else if (user && pathname === "/login") {
        router.push("/coming-soon");
      }
    }
  }, [user, loading, initializing, pathname, router]);

  const signOut = async () => {
    try {
      await auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("サインアウトエラー:", error);
    }
  };

  if (loading || initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffc617] mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = (): UserContextData => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useAuthはAuthProvider内で使用する必要があります");
  }
  return context;
};
