import React from "react";
export default function Features() {
    return (
        <div className="page max-w-7xl mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold mb-6">All Features of CodeMaster LMS</h1>
            <ul className="list-disc ml-6 space-y-3 text-lg">
                <li>Interactive Monaco code editor supporting multiple languages</li>
                <li>Real-time analytics and student performance tracking</li>
                <li>OTP-based passwordless authentication for secure login</li>
                <li>Live monitoring of student coding activity via Socket.io</li>
                <li>Automated plagiarism and cheat detection system</li>
                <li>Gamification: badges, leaderboards, streaks, and titles</li>
                <li>Dark and light theme toggle for user preference</li>
                <li>Responsive design optimized for desktop and mobile</li>
                <li>Comprehensive teacher dashboard with task management</li>
                <li>Full student dashboard with tasks, analytics, and leaderboards</li>
            </ul>
            <p className="mt-10 text-gray-600">
                The platform is designed to facilitate performance-based coding learning with cle
            </p>
        </div>
    );
}