// pages/AvyuktForm.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AvyuktForm() {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    currentYear: "",
    email: "",
    phoneNo: "",
    whyJoin: "",
    techSkills: "",
    projectInterest: "",
    weeklyTime: "",
    projectLink: "",
    appliedFor: "",
  });

  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch applicants
  useEffect(() => {
    fetchApplicants();

    // ✅ Live listener
    const channel = supabase
      .channel("avyukt-applicant-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "avyukt_applications" },
        (payload) => {
          setApplicants((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchApplicants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("avyukt_applications")
      .select("id, name, course, current_year, applied_for")
      .order("id", { ascending: false });
    if (!error) setApplicants(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("avyukt_applications").insert([
      {
        name: formData.name,
        course: formData.course,
        current_year: formData.currentYear,
        email: formData.email,
        phone_no: formData.phoneNo,
        why_join: formData.whyJoin,
        tech_skills: formData.techSkills,
        project_interest: formData.projectInterest,
        weekly_time: formData.weeklyTime,
        project_link: formData.projectLink,
        applied_for: formData.appliedFor,
      },
    ]);

    setFormData({
      name: "",
      course: "",
      currentYear: "",
      email: "",
      phoneNo: "",
      whyJoin: "",
      techSkills: "",
      projectInterest: "",
      weeklyTime: "",
      projectLink: "",
      appliedFor: "",
    });

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6 flex flex-col items-center">
      {/* HEADER */}
      <motion.h1
        className="text-xl md:text-3xl font-bold mb-6 tracking-widest text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        [ AVYUKT DEVELOPMENT TEAM : APPLICATION TERMINAL ] <span className="animate-pulse">█</span>
      </motion.h1>

      <motion.p
        className="text-green-300 text-center mb-8 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Join the Avyukt development team and work on cutting-edge projects. 
        We're looking for passionate developers, designers, and innovators.

        Shortlisted candidates will be notified Soon!!
      </motion.p>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full border border-green-500/40 
                   p-6 rounded-lg bg-black/70 
                   shadow-[0_0_20px_#22c55e80] text-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span>&gt; NAME*:</span>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-green-500 text-green-300 
                         p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            />
          </label>

          <label className="block">
            <span>&gt; EMAIL*:</span>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-black border border-green-500 text-green-300 
                         p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            />
          </label>

          <label className="block">
            <span>&gt; COURSE:</span>
            <select
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="w-full bg-black border border-green-500 text-green-300 
                         p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            >
              <option value="">-- Select Course --</option>
              <option>BCA</option>
              <option>BBA</option>
              <option>B TECH</option>
              <option>BBALLB</option>
              <option>MBA</option>
              <option>BAJMC</option>
              <option>Other</option>
            </select>
          </label>

          <label className="block">
            <span>&gt; CURRENT YEAR*:</span>
            <select
              required
              value={formData.currentYear}
              onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
              className="w-full bg-black border border-green-500 text-green-300 
                         p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            >
              <option value="">-- Select Year --</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
              <option>5th Year</option>
            </select>
          </label>

          <label className="block">
            <span>&gt; PHONE NO*:</span>
            <input
              type="tel"
              required
              value={formData.phoneNo}
              onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
              className="w-full bg-black border border-green-500 text-green-300 
                         p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            />
          </label>

          <label className="block">
            <span>&gt; APPLYING FOR*:</span>
            <select
              required
              value={formData.appliedFor}
              onChange={(e) => setFormData({ ...formData, appliedFor: e.target.value })}
              className="w-full bg-black border border-green-500 text-green-300 
                         p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            >
              <option value="">-- Select Role --</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>UI/UX Designer</option>
              <option>Graphics/Branding</option>
              <option>AI/ML</option>
              <option>Automation</option>
            </select>
          </label>
        </div>

        <label className="block mt-4">
          <span>&gt; WHY DO YOU WANT TO JOIN THE TEAM?*:</span>
          <textarea
            required
            rows={3}
            value={formData.whyJoin}
            onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            placeholder="Tell us about your motivation and passion..."
          />
        </label>

        <label className="block mt-4">
          <span>&gt; TECH SKILLS YOU KNOW:</span>
          <textarea
            rows={2}
            value={formData.techSkills}
            onChange={(e) => setFormData({ ...formData, techSkills: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            placeholder="e.g., JavaScript, React, Python, Figma, etc."
          />
        </label>

        <label className="block mt-4">
          <span>&gt; WHAT PROJECT WOULD YOU LOVE TO WORK ON?</span>
          <textarea
            rows={2}
            value={formData.projectInterest}
            onChange={(e) => setFormData({ ...formData, projectInterest: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            placeholder="Describe your dream project or ideas..."
          />
        </label>

        <label className="block mt-4">
          <span>&gt; HOW MUCH TIME CAN YOU GIVE WEEKLY?</span>
          <select
            value={formData.weeklyTime}
            onChange={(e) => setFormData({ ...formData, weeklyTime: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
          >
            <option value="">-- Select Time Commitment --</option>
            <option>5-10 hours</option>
            <option>10-15 hours</option>
            <option>15-20 hours</option>
            <option>20+ hours</option>
            <option>Flexible</option>
          </select>
        </label>

        <label className="block mt-4">
          <span>&gt; PROJECT LINK/GITHUB:</span>
          <input
            type="url"
            value={formData.projectLink}
            onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none focus:border-green-400"
            placeholder="https://github.com/yourusername or project URL"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-green-500 px-4 py-3 mt-6 
                     hover:bg-green-500 hover:text-black 
                     transition text-sm font-semibold tracking-wider"
        >
          {submitting ? "[ PROCESSING APPLICATION... ]" : "[ SUBMIT AVYUKT APPLICATION ]"}
        </button>
      </form>

      {/* APPLICANTS LIST */}
      <div className="mt-12 w-full max-w-4xl">
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-green-300">
          🚀 Avyukt Team Applicants
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-lg bg-gradient-to-r 
                           from-gray-800 via-gray-700 to-gray-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {applicants.map((applicant) => (
              <motion.div
                key={applicant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-black/60 border border-green-400/30 
                           shadow-md hover:shadow-green-400/50 transition text-sm"
              >
                <p className="font-semibold text-green-200">{applicant.name}</p>
                <p className="text-green-400">
                  {applicant.course} — {applicant.current_year}
                </p>
                <p className="text-green-300 text-xs mt-1">
                  🎯 {applicant.applied_for}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
