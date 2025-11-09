import React from "react";
import AppLink from "../../components/AppLink";

export default function LandingPage() {
  const team = [
    {
      name: "Aryan Saharan",
      username: "AryanSaharan01",
      avatar:
        "https://cdn.projexa.ai/user/profile-pictures/9b4484eea9b144bea528c5d252f9dd07/profile.jpg",
    },
    {
      name: "Sachidanand Tiwari",
      username: "TiSac24",
      avatar:
        "https://avatars.githubusercontent.com/u/124254763?s=400&u=c16644a831d5fd7104c10c3ef111e309dea4443f&v=4",
    },
  ];

  const stats = [
    { label: "Active Students", value: "2,500+", icon: "👥" },
    { label: "Average Satisfaction", value: "98%", icon: "⭐" },
    { label: "Live Sessions / Month", value: "340+", icon: "📈" },
  ];

  const testimonials = [
    {
      quote:
        "EduTrack LMS Pro made tracking my coding progress effortless. The analytics help me stay consistent.",
      name: "Priya Sharma",
      role: "Computer Science Undergraduate",
      avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
      quote:
        "I can monitor every student's code activity in real time. Feedback cycles are faster than ever.",
      name: "Rohan Gupta",
      role: "Faculty - Programming",
      avatar: "https://i.pravatar.cc/80?img=30",
    },
    {
      quote:
        "The anti-cheat and leaderboard system keeps the class competitive and honest. Brilliant platform.",
      name: "Neha Verma",
      role: "Academic Mentor",
      avatar: "https://i.pravatar.cc/80?img=50",
    },
  ];

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Code Tracking",
      desc: "Monitor active editor sessions & progress instantly.",
    },
    {
      icon: "🧠",
      title: "AI Feedback Engine",
      desc: "Actionable suggestions to improve code quality.",
    },
    {
      icon: "🛡️",
      title: "Anti‑Cheat Layer",
      desc: "Similarity checks & anomaly detection built-in.",
    },
    {
      icon: "📊",
      title: "Deep Analytics",
      desc: "Performance trends, heat maps & learning velocity.",
    },
    {
      icon: "🏆",
      title: "Gamified Growth",
      desc: "Badges, streaks & leaderboards to motivate.",
    },
    {
      icon: "🌍",
      title: "Device Fluid",
      desc: "Optimized for mobile, tablet & desktop use.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ET</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-slate-800">EduTrack</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-teal-100 text-teal-700 font-semibold">
                PRO
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AppLink
              to="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition"
            >
              Sign In
            </AppLink>
            <AppLink
              to="/auth/login"
              className="bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-lg shadow-sm hover:bg-teal-700 hover:shadow-md transition"
            >
              Try Free
            </AppLink>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-slate-700">
                Trusted by 2,500+ students
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              Transform Learning with
              <span className="block mt-2 bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                EduTrack LMS Pro
              </span>
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              AI-guided coding, live progress tracking, anti‑cheat automation,
              gamified performance, and classroom clarity—all in one modern
              platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <AppLink
                to="/auth/login"
                state={{ role: "teacher" }}
                className="inline-flex items-center justify-center bg-teal-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-teal-700 hover:shadow-xl transition"
              >
                Get Started Free
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </AppLink>
              <AppLink
                to="/public/features"
                className="inline-flex items-center justify-center bg-white text-slate-700 font-semibold px-8 py-4 rounded-lg border-2 border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition"
              >
                Explore Features
              </AppLink>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-2xl font-bold text-teal-600">{s.value}</span>
                  </div>
                  <p className="text-xs text-slate-600">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Component */}
          <div className="w-full">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Meet Our Team</h3>
              <div className="space-y-4">
                {team.map((member) => (
                  <div
                    key={member.username}
                    className="group bg-gradient-to-r from-slate-50 to-teal-50 rounded-xl p-5 flex items-center gap-4 border border-slate-200 hover:border-teal-300 hover:shadow-md transition"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-teal-500 ring-offset-2"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-lg">
                        {member.name}
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            `https://github.com/${member.username}`,
                            "_blank"
                          )
                        }
                        className="mt-1 inline-flex items-center text-sm text-slate-500 hover:text-teal-600 transition"
                      >
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        @{member.username}
                      </button>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-slate-500 text-center">
                Passionate builders crafting the future of adaptive learning
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Platform Highlights
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need to excel in coding education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl transition"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition">
                  <span className="text-3xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-teal-600 transition">
                  {f.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Voices From Our Community
            </h2>
            <p className="text-lg text-slate-600">
              See what students and educators are saying
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-teal-300 transition"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-500 ring-offset-2"
                  />
                  <div>
                    <p className="font-semibold text-slate-800">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex gap-1 mt-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Your Journey Today
            </h2>
            <p className="text-xl text-teal-50 mb-8">
              Zero setup • Guided onboarding • Made for serious growth
            </p>
            <AppLink
              to="/auth/login"
              className="inline-flex items-center bg-white text-teal-600 font-bold px-10 py-5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition"
            >
              Launch Dashboard
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </AppLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">
            &copy; 2025 EduTrack LMS Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
