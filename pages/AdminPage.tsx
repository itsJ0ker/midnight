// src/pages/AdminPage.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AdminUser = {
  id: string;
  email: string;
  role: "god" | "admin";
};

type Student = {
  id: string;
  name: string;
  email: string;
  course: string;
  year: string;
  contact: string;
  reason: string;
  resume_url?: string;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "god">("admin");

  // ---------- LOGIN ----------
  const handleLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password) // 🔴 not secure! (hash in prod)
      .single();

    if (error || !data) {
      alert("Invalid credentials!");
      setLoading(false);
      return;
    }

    setAdmin(data as AdminUser);
    setLoading(false);
  };

  // ---------- FETCH STUDENTS ----------
  const fetchStudents = async () => {
    const { data, error } = await supabase.from("applications").select("*");
    if (!error && data) setStudents(data as Student[]);
  };

  useEffect(() => {
    if (admin) {
      fetchStudents();
      // Live updates via Supabase Realtime
      const channel = supabase
        .channel("applications-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "applications" },
          () => {
            fetchStudents();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [admin]);

  // ---------- ADD ADMIN (God only) ----------
  const addAdmin = async () => {
    if (!newAdminEmail) return;
    const { error } = await supabase.from("admins").insert([
      { email: newAdminEmail, password: "1234", role: newAdminRole },
    ]);
    if (error) alert("Failed to add admin");
    else {
      alert("Admin added successfully (default pass: 1234)");
      setNewAdminEmail("");
    }
  };

  // ---------- LOGIN UI ----------
  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-mono">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-xl tracking-widest"
        >
          {">>> Midnight Club Secure Access Terminal <<<"}
          <span className="animate-pulse">_</span>
        </motion.h1>

        <div className="bg-black border border-green-500 p-6 rounded-lg shadow-lg shadow-green-500/20 w-80">
          <p className="mb-3 text-green-300">[SYSTEM] Authentication Required</p>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 bg-black border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 bg-black border border-green-500 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-black font-bold"
          >
            {loading ? "Verifying..." : "Access System"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD UI ----------
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-6">
      <h1 className="text-3xl font-bold mb-4">
        Midnight Club Admin Dashboard
      </h1>
      <p className="mb-6">
        Welcome, {admin.email} — Role:{" "}
        <span className="text-green-300">{admin.role}</span>
      </p>

      {/* GOD PANEL */}
      {admin.role === "god" && (
        <div className="mb-10 border border-green-500 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3">⚡ God Panel: Manage Admins</h2>
          <div className="flex gap-2">
            <input
              placeholder="New Admin Email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="p-2 bg-black border border-green-500 rounded"
            />
            <select
              value={newAdminRole}
              onChange={(e) =>
                setNewAdminRole(e.target.value as "admin" | "god")
              }
              className="p-2 bg-black border border-green-500 rounded"
            >
              <option value="admin">Admin</option>
              <option value="god">God</option>
            </select>
            <button
              onClick={addAdmin}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-black font-bold"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* STUDENT APPLICATIONS */}
      <div>
        <h2 className="text-xl font-bold mb-4">📋 Student Applications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-black border border-green-500 rounded-lg hover:shadow-lg hover:shadow-green-500/20 transition"
            >
              <p>
                <span className="font-bold text-green-300">Name:</span>{" "}
                {student.name}
              </p>
              <p>
                <span className="font-bold text-green-300">Course:</span>{" "}
                {student.course}
              </p>
              <p>
                <span className="font-bold text-green-300">Year:</span>{" "}
                {student.year}
              </p>
              <p>
                <span className="font-bold text-green-300">Contact:</span>{" "}
                {student.contact}
              </p>
              <p>
                <span className="font-bold text-green-300">Why:</span>{" "}
                {student.reason}
              </p>
              {student.resume_url && (
                <a
                  href={student.resume_url}
                  target="_blank"
                  className="text-green-400 underline hover:text-green-200"
                >
                  View Resume
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
