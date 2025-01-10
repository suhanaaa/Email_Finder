"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface EmailResponse {
  valid_emails: {
    email: string;
    score: number;
    deliverable: boolean;
    first_name: string;
    last_name: string;
    full_name: string;
    domain: string;
    smtp_provider: string;
    state: string;
    avatar: string;
  }[];
}

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [fullName, setFullName] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<EmailResponse | null>(null);
  const [error, setError] = useState("");

  // Auto-detect system theme preference
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          company_url: companyUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const data = await res.json();
      setResponse(data);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the data"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"
          : "bg-gradient-to-br from-gray-50 via-slate-100 to-white"
      }`}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`fixed top-6 right-6 p-2 rounded-full transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
              : "bg-white text-gray-800 hover:bg-gray-100"
          } shadow-lg`}
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>

        <h1
          className={`text-5xl font-bold text-center mb-12 ${
            isDarkMode
              ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400"
              : "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600"
          }`}
        >
          Email Variation Finder
        </h1>

        <form
          onSubmit={handleSubmit}
          className={`backdrop-blur-lg rounded-xl shadow-2xl p-8 mb-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-800/40 border border-gray-700/50"
              : "bg-white/80 border border-gray-200"
          }`}
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg transition duration-200
                  ${
                    isDarkMode
                      ? "bg-gray-900/30 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-cyan-600/50 focus:border-cyan-600/50"
                  }
                  border focus:ring-2`}
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label
                htmlFor="companyUrl"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Company Website
              </label>
              <input
                type="text"
                id="companyUrl"
                value={companyUrl}
                onChange={(e) => setCompanyUrl(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg transition duration-200
                  ${
                    isDarkMode
                      ? "bg-gray-900/30 border-gray-700/50 text-gray-100 placeholder-gray-500 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-cyan-600/50 focus:border-cyan-600/50"
                  }
                  border focus:ring-2`}
                placeholder="example.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition duration-300
                ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-600 hover:via-teal-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-700 hover:via-teal-700 hover:to-emerald-700 text-white"
                }
                disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                "Find Email Variations"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div
            className={`px-6 py-4 rounded-lg mb-6 backdrop-blur-lg ${
              isDarkMode
                ? "bg-red-900/50 border-red-700 text-red-200"
                : "bg-red-100 border-red-200 text-red-800"
            } border`}
          >
            {error}
          </div>
        )}

        {response && (
          <div className="space-y-6">
            <h2
              className={`text-2xl font-semibold mb-6 ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {response.valid_emails.length > 0
                ? "Found Email Variations"
                : "No Results Found"}
            </h2>

            {response.valid_emails.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {response.valid_emails.map((email, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-lg rounded-xl p-6 shadow-xl
                      hover:shadow-2xl hover:scale-[1.01] transition-all duration-300
                      ${
                        isDarkMode
                          ? "bg-gray-800/40 border-gray-700/50"
                          : "bg-white/80 border-gray-200"
                      } border`}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      {email.avatar && (
                        <Image
                          src={email.avatar}
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-blue-500/30"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src =
                              "https://www.gravatar.com/avatar/default?d=mp";
                          }}
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-100">
                          {email.full_name}
                        </h3>
                        <p className="text-sm text-blue-400">{email.email}</p>
                      </div>
                    </div>
                    <div className="space-y-3 border-t border-gray-700 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Deliverable:</span>
                        <span
                          className={`font-medium ${
                            email.deliverable
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {email.deliverable ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Score:</span>
                        <span className="font-medium text-blue-400">
                          {email.score}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Provider:</span>
                        <span className="font-medium text-gray-300">
                          {email.smtp_provider}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`backdrop-blur-lg rounded-xl p-8 text-center shadow-xl border
                  ${
                    isDarkMode
                      ? "bg-gray-800/40 border-gray-700/50 text-gray-300"
                      : "bg-white/80 border-gray-200 text-gray-600"
                  }`}
              >
                <div className="mb-4 text-5xl">🔍</div>
                <p className="text-lg mb-2">No email variations found</p>
                <p className="text-sm opacity-75">
                  We couldn&apos;t find any valid email variations for this name
                  and domain combination.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
