import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function LivePreview() {
  const [socket, setSocket] = useState(null);
  const [activeStudents, setActiveStudents] = useState({});
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("connect_error", (error) => {
      setError("Failed to connect to server");
      console.error("Socket connection error:", error);
    });

    newSocket.on("active-students-update", (data) => {
      setActiveStudents(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedStudentId && activeStudents[selectedStudentId]) {
      // For demo: simulate code fetch
      setSelectedCode("// Student code preview will appear here...");
    } else {
      setSelectedCode("");
    }
  }, [selectedStudentId, activeStudents]);

  if (error) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="page flex gap-8 max-w-7xl mx-auto">
      <section className="w-1/3 bg-white dark:bg-gray-900 rounded-md p-4 shadow-lg overflow-hidden">
        <h2 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white">
          Active Students
        </h2>
        <ul className="space-y-2">
          {Object.entries(activeStudents).map(([socketId, s]) => (
            <li
              key={socketId}
              className={`cursor-pointer p-3 rounded transition-colors
                ${socketId === selectedStudentId
                  ? "bg-indigo-300 dark:bg-indigo-600 text-white"
                  : "hover:bg-indigo-100 dark:hover:bg-indigo-800"
                }`}
              onClick={() => setSelectedStudentId(socketId)}
            >
              <span className="font-medium">
                {s.studentId} - Task: {s.taskId}
              </span>
              <span className="ml-2">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    s.status === "attempting" ? "text-green-600 dark:text-green-400" :
                    s.status === "submitted" ? "text-yellow-600 dark:text-yellow-400" :
                    "text-red-600 dark:text-red-400"
                  }`}
                >
                  {s.status}
                </span>
              </span>
            </li>
          ))}
          {Object.keys(activeStudents).length === 0 && (
            <li className="text-gray-400 dark:text-gray-500 text-center py-4">
              No active students right now.
            </li>
          )}
        </ul>
      </section>

      <section className="flex-1 bg-white dark:bg-gray-900 rounded-md p-4 shadow-lg overflow-hidden">
        <h2 className="font-semibold text-xl mb-3 text-gray-900 dark:text-white">
          Student Code Preview
        </h2>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-[70vh] overflow-auto w-full font-mono text-sm">
          {selectedCode || "Select a student to view their code"}
        </pre>
      </section>
    </div>
  );
}