// pages/ApplicationForm.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ApplicationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    contact: "",
    reason: "",
  });

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch students
  useEffect(() => {
    fetchStudents();

    // ✅ Live listener
    const channel = supabase
      .channel("student-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "applications" },
        (payload) => {
          setStudents((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("id, name, course, year")
      .order("id", { ascending: false });
    if (!error) setStudents(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("applications").insert([
      {
        name: formData.name,
        email: formData.email,
        course: formData.course,
        year: formData.year,
        contact: formData.contact,
        reason: formData.reason,
      },
    ]);

    setFormData({
      name: "",
      email: "",
      course: "",
      year: "",
      contact: "",
      reason: "",
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
        [ SYSTEM ACCESS : APPLICATION TERMINAL ] <span className="animate-pulse">█</span>
      </motion.h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg w-full border border-green-500/40 
                   p-4 rounded-lg bg-black/70 
                   shadow-[0_0_20px_#22c55e80] text-sm"
      >
        <label className="block mb-3">
          <span>&gt; NAME*:</span>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none"
          />
        </label>

        <label className="block mb-3">
          <span>&gt; EMAIL*:</span>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none"
          />
        </label>

        <label className="block mb-3">
          <span>&gt; COURSE*:</span>
          <select
            required
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none"
          >
            <option value="">-- Select Course --</option>
            <option>BCA</option>
            <option>BBA</option>
            <option>B TECH</option>
            <option>BBALLB</option>
            <option>MBA</option>
            <option>BAJMC</option>
          </select>
        </label>

        <label className="block mb-3">
          <span>&gt; YEAR*:</span>
          <select
            required
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none"
          >
            <option value="">-- Select Year --</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
            <option>5th Year</option>
          </select>
        </label>

        <label className="block mb-3">
          <span>&gt; CONTACT*:</span>
          <input
            type="tel"
            required
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none"
          />
        </label>

        <label className="block mb-3">
          <span>&gt; WHY JOIN?*:</span>
          <textarea
            required
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full bg-black border border-green-500 text-green-300 
                       p-2 mt-1 text-sm focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-green-500 px-3 py-2 mt-4 
                     hover:bg-green-500 hover:text-black 
                     transition text-sm"
        >
          {submitting ? "[ PROCESSING... ]" : "[ SUBMIT APPLICATION ]"}
        </button>
      </form>

      {/* STUDENTS LIST */}
      <div className="mt-12 w-full max-w-3xl">
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-green-300">
          📋 Applied Students
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-gradient-to-r 
                           from-gray-800 via-gray-700 to-gray-800 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {students.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-black/60 border border-green-400/30 
                           shadow-md hover:shadow-green-400/50 transition text-sm"
              >
                <p className="font-semibold text-green-200">{student.name}</p>
                <p className="text-green-400">
                  {student.course} — {student.year}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
