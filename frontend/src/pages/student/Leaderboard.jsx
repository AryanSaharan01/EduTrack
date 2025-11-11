import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/performance/leaderboard")
      .then(res => setLeaderboard(res.data.leaderboard || []))
      .catch(err => {
        console.error(err);
        setError("Failed to load leaderboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl animate-spin mx-auto mb-4" 
               style={{ animationDuration: '3s' }} />
          <p className="text-slate-600 font-medium mt-3">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-200 max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-4xl">⚠️</span>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return { icon: "🥇", bg: "from-yellow-400 to-orange-400", text: "text-yellow-900" };
    if (rank === 2) return { icon: "🥈", bg: "from-gray-300 to-gray-400", text: "text-gray-900" };
    if (rank === 3) return { icon: "🥉", bg: "from-orange-300 to-orange-400", text: "text-orange-900" };
    return { icon: `#${rank}`, bg: "from-slate-200 to-slate-300", text: "text-slate-700" };
  };

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      <div className="px-8 py-6 space-y-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-7 border border-slate-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg text-sm font-semibold mb-3">
                <span className="text-xl">🏆</span>
                <span>Top Performers</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Leaderboard
                </span>
              </h1>
              <p className="text-base text-slate-600">
                See how you rank among your peers
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-6 transition-all cursor-pointer">
                <span className="text-4xl">👑</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200 flex gap-3 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilter("month")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filter === "month"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
              filter === "week"
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            This Week
          </button>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            
            {/* 2nd Place */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl shadow-lg">
                  🥈
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-slate-900">{leaderboard[1]?.name}</p>
                  <p className="text-sm text-slate-500">2nd Place</p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-3 mt-3">
                  <p className="text-3xl font-bold text-gray-700">{leaderboard[1]?.total_marks}</p>
                  <p className="text-xs text-slate-500">Total Marks</p>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-xl p-6 border-2 border-yellow-300 hover:shadow-2xl transition-all transform hover:-translate-y-2 relative -mt-4">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <span className="text-xl">👑</span>
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center text-5xl shadow-xl animate-pulse">
                  🥇
                </div>
                <div className="mb-2">
                  <p className="text-3xl font-bold text-slate-900">{leaderboard[0]?.name}</p>
                  <p className="text-sm text-yellow-700 font-bold">🏆 CHAMPION</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mt-3">
                  <p className="text-4xl font-bold text-yellow-800">{leaderboard[0]?.total_marks}</p>
                  <p className="text-xs text-yellow-700 font-semibold">Total Marks</p>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-all transform hover:-translate-y-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl shadow-lg">
                  🥉
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-slate-900">{leaderboard[2]?.name}</p>
                  <p className="text-sm text-slate-500">3rd Place</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 mt-3">
                  <p className="text-3xl font-bold text-orange-700">{leaderboard[2]?.total_marks}</p>
                  <p className="text-xs text-slate-500">Total Marks</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Complete Rankings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Total Marks</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {leaderboard.map((student, index) => {
                  const badge = getRankBadge(student.rank);
                  return (
                    <tr
                      key={student.rank}
                      className={`hover:bg-slate-50 transition-colors ${
                        student.rank <= 3 ? 'bg-gradient-to-r from-yellow-50/30 to-orange-50/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${badge.bg} rounded-xl shadow-md font-bold text-lg ${badge.text}`}>
                          {badge.icon}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow">
                            {student.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{student.name}</p>
                            {student.rank <= 3 && (
                              <p className="text-xs text-yellow-600 font-semibold">⭐ Top Performer</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-bold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {student.total_marks}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                              style={{ width: `${student.accuracy_percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-slate-900">{student.accuracy_percentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {student.badge ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-bold text-sm">
                            🏅 {student.badge}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

