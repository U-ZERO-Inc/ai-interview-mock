"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hook/user-context";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (user) {
      router.push("/coming-soon");
    }
  }, [user, router]);

  // ユーザーがログイン済みの場合は何も表示しない
  if (user) {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push("/coming-soon");
    } catch (error: unknown) {
      console.error("認証エラー:", error);
      const firebaseError = error as { code?: string };
      switch (firebaseError.code) {
        case "auth/user-not-found":
          setError("ユーザーが見つかりません");
          break;
        case "auth/wrong-password":
          setError("パスワードが間違っています");
          break;
        case "auth/email-already-in-use":
          setError("このメールアドレスは既に使用されています");
          break;
        case "auth/weak-password":
          setError("パスワードは6文字以上で入力してください");
          break;
        case "auth/invalid-email":
          setError("有効なメールアドレスを入力してください");
          break;
        default:
          setError("認証に失敗しました。もう一度お試しください。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center mb-6 p-2 border-b">
              <Image
                src="/assets/logo.svg"
                alt="Logo"
                width={120}
                height={40}
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">ログイン</h2>
            <p className="text-gray-600">アカウントにログインしてください</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "メールアドレスは必須です",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "有効なメールアドレスを入力してください",
                    },
                  })}
                  className={`appearance-none relative block w-full px-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none sm:text-sm transition-colors ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="your@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  パスワード
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "パスワードは必須です",
                      minLength: {
                        value: 6,
                        message: "パスワードは6文字以上で入力してください",
                      },
                    })}
                    className={`appearance-none relative block w-full px-3 py-3 pr-10 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none sm:text-sm transition-colors ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="パスワードを入力"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#ffc617] hover:bg-[#e6b315] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc617] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    処理中...
                  </div>
                ) : (
                  "ログイン"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
