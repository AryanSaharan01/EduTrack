import React, { useEffect, useState } from "react";
import api from "../../utils/api.js";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/performance/leaderboard")
      .then(res => setLeaderboard(res.data.leaderboard))
      .catch(err => {
        console.error(err);
        setError("Failed to load leaderboard");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page text-center text-gray-600 dark:text-gray-400">
        Loading leaderboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="page max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Leaderboard
      </h1>
      
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">Rank</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">Name</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">Total Marks</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">Accuracy</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">Badge</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(({ rank, name, total_marks, accuracy_percentage, badge }) => (
              <tr 
                key={rank} 
                className={`
                  ${rank <= 3 ? "font-bold" : ""} 
                  ${rank === 1 ? "bg-yellow-50 dark:bg-yellow-900/20" : ""}
                  hover:bg-gray-50 dark:hover:bg-gray-800/50
                `}
              >
                <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">{rank}</td>
                <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">{name}</td>
                <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">{total_marks}</td>
                <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">{accuracy_percentage}%</td>
                <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">{badge || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

