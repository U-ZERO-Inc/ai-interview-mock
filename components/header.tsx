"use client";

import Image from "next/image";
import { useAuth } from "@/hook/user-context";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="/assets/logo.svg"
              alt="Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center text-sm text-[#ffc617] hover:text-[#e6b315] font-medium transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                  ログアウト
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center text-sm text-[#ffc617] hover:text-[#e6b315] font-medium transition-colors"
              >
                ログイン
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
