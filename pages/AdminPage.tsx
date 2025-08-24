// src/pages/AdminPage.tsx
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaUserShield, FaUsers, FaCode, FaExclamationTriangle } from "react-icons/fa";

// Init Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type AdminUser = {
  id: string;
  email: string;
  role: "god" | "admin";
  created_at: string;
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

type AvyuktApplicant = {
  id: string;
  name: string;
  email: string;
  course: string;
  current_year: string;
  phone_no: string;
  why_join: string;
  tech_skills: string;
  project_interest: string;
  weekly_time: string;
  project_link: string;
  applied_for: string;
  created_at: string;
};

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [avyuktApplicants, setAvyuktApplicants] = useState<AvyuktApplicant[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "god">("admin");
  const [allAdmins, setAllAdmins] = useState<AdminUser[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"admin" | "application" | "avyukt" | null>(null);

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

  // ---------- FETCH AVYUKT APPLICANTS ----------
  const fetchAvyuktApplicants = async () => {
    const { data, error } = await supabase.from("avyukt_applications").select("*").order("created_at", { ascending: false });
    if (!error && data) setAvyuktApplicants(data as AvyuktApplicant[]);
  };

  // ---------- FETCH ALL ADMINS ----------
  const fetchAllAdmins = async () => {
    const { data, error } = await supabase.from("admins").select("*").order("created_at", { ascending: false });
    if (!error && data) setAllAdmins(data as AdminUser[]);
  };

  // ---------- DELETE FUNCTIONS ----------
  const deleteAdmin = async (adminId: string) => {
    if (admin.role !== "god") {
      alert("Only God users can delete admins");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", adminId);
        
      if (error) {
        console.error("Delete admin error:", error);
        alert(`Failed to delete admin: ${error.message}`);
      } else {
        alert("Admin deleted successfully");
        await fetchAllAdmins(); // Refresh the admin list
      }
    } catch (err) {
      console.error("Delete admin exception:", err);
      alert("An error occurred while deleting the admin");
    }
    
    setShowDeleteConfirm(null);
    setDeleteType(null);
  };

  const deleteApplication = async (applicationId: string) => {
    if (admin.role !== "god") {
      alert("Only God users can delete applications");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", applicationId);
        
      if (error) {
        console.error("Delete application error:", error);
        alert(`Failed to delete application: ${error.message}`);
      } else {
        alert("Application deleted successfully");
        await fetchStudents();
      }
    } catch (err) {
      console.error("Delete application exception:", err);
      alert("An error occurred while deleting the application");
    }
    
    setShowDeleteConfirm(null);
    setDeleteType(null);
  };

  const deleteAvyuktApplication = async (applicationId: string) => {
    if (admin.role !== "god") {
      alert("Only God users can delete Avyukt applications");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("avyukt_applications")
        .delete()
        .eq("id", applicationId);
        
      if (error) {
        console.error("Delete Avyukt application error:", error);
        alert(`Failed to delete Avyukt application: ${error.message}`);
      } else {
        alert("Avyukt application deleted successfully");
        await fetchAvyuktApplicants();
      }
    } catch (err) {
      console.error("Delete Avyukt application exception:", err);
      alert("An error occurred while deleting the Avyukt application");
    }
    
    setShowDeleteConfirm(null);
    setDeleteType(null);
  };

  const handleDeleteClick = (id: string, type: "admin" | "application" | "avyukt") => {
    console.log(`Attempting to delete ${type} with ID:`, id);
    setShowDeleteConfirm(id);
    setDeleteType(type);
  };

  // Debug function to check admin permissions
  const debugAdminPermissions = async () => {
    if (admin.role !== "god") {
      console.log("Current user is not a god user");
      return;
    }
    
    console.log("Current user is a god user, checking permissions...");
    const { data, error } = await supabase.from("admins").select("*");
    console.log("All admins:", data);
    console.log("Error if any:", error);
  };

  useEffect(() => {
    if (admin) {
      fetchStudents();
      fetchAvyuktApplicants();
      if (admin.role === "god") {
        fetchAllAdmins();
      }
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
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "avyukt_applications" },
          () => {
            fetchAvyuktApplicants();
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "admins" },
          () => {
            if (admin.role === "god") {
              fetchAllAdmins();
            }
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
      {/* Header */}
      <div className="mb-8">
        <motion.h1 
          className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Midnight Club Admin Dashboard
        </motion.h1>
        <motion.p 
          className="text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome, <span className="text-green-300 font-semibold">{admin.email}</span> — 
          Role: <span className={`px-2 py-1 rounded text-xs font-bold ${admin.role === "god" ? "bg-red-600 text-white" : "bg-green-600 text-black"}`}>
            {admin.role.toUpperCase()}
          </span>
        </motion.p>
      </div>

      {/* GOD PANEL */}
      {admin.role === "god" && (
        <motion.div 
          className="mb-10 border border-green-500 p-6 rounded-lg bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FaUserShield className="text-2xl text-green-400" />
            <h2 className="text-2xl font-bold text-green-300">⚡ God Panel: Admin Management</h2>
          </div>
          
          {/* Add New Admin */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <input
              placeholder="New Admin Email"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              className="p-3 bg-black border border-green-500 rounded-lg focus:outline-none focus:border-green-400"
            />
            <select
              value={newAdminRole}
              onChange={(e) => setNewAdminRole(e.target.value as "admin" | "god")}
              className="p-3 bg-black border border-green-500 rounded-lg focus:outline-none focus:border-green-400"
            >
              <option value="admin">Admin</option>
              <option value="god">God</option>
            </select>
                         <button
               onClick={addAdmin}
               className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-black font-bold transition-colors"
             >
               Add Admin
             </button>
             <button
               onClick={debugAdminPermissions}
               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors"
               title="Debug permissions (check console)"
             >
               Debug
             </button>
          </div>

          {/* Admin List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-green-200">Current Admins</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAdmins.map((adminUser) => (
                <motion.div
                  key={adminUser.id}
                  className="p-4 border border-green-500/30 rounded-lg bg-black/40 hover:border-green-400 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-green-200">{adminUser.email}</p>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        adminUser.role === "god" ? "bg-red-600 text-white" : "bg-green-600 text-black"
                      }`}>
                        {adminUser.role.toUpperCase()}
                      </span>
                    </div>
                    {adminUser.id !== admin.id && (
                      <button
                        onClick={() => handleDeleteClick(adminUser.id, "admin")}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete Admin"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-green-500">
                    Created: {new Date(adminUser.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* STUDENT APPLICATIONS */}
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-2xl text-green-400" />
          <h2 className="text-2xl font-bold text-green-300">📋 Student Applications</h2>
          <span className="px-3 py-1 bg-green-600 text-black text-sm font-bold rounded-full">
            {students.length}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {students.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-black/40 border border-green-500/30 rounded-lg hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:border-green-400"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-green-200">{student.name}</h3>
                {admin.role === "god" && (
                  <button
                    onClick={() => handleDeleteClick(student.id, "application")}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete Application"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-bold text-green-300">Course:</span>{" "}
                  <span className="text-green-200">{student.course}</span>
                </p>
                <p>
                  <span className="font-bold text-green-300">Year:</span>{" "}
                  <span className="text-green-200">{student.year}</span>
                </p>
                <p>
                  <span className="font-bold text-green-300">Contact:</span>{" "}
                  <a href={`tel:${student.contact}`} className="text-green-400 hover:text-green-200">
                    {student.contact}
                  </a>
                </p>
                <p>
                  <span className="font-bold text-green-300">Why Join:</span>{" "}
                  <span className="text-green-200">{student.reason}</span>
                </p>
                {student.resume_url && (
                  <a
                    href={student.resume_url}
                    target="_blank"
                    className="text-green-400 underline hover:text-green-200 text-sm"
                  >
                    📄 View Resume
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AVYUKT DEVELOPMENT TEAM APPLICATIONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <FaCode className="text-2xl text-green-400" />
          <h2 className="text-2xl font-bold text-green-300">🚀 Avyukt Development Team Applications</h2>
          <span className="px-3 py-1 bg-green-600 text-black text-sm font-bold rounded-full">
            {avyuktApplicants.length}
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {avyuktApplicants.map((applicant) => (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 bg-black/40 border border-green-500/30 rounded-lg hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 hover:border-green-400"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-green-200">{applicant.name}</h3>
                  <span className="px-2 py-1 bg-green-600 text-black text-xs rounded font-semibold">
                    {applicant.applied_for}
                  </span>
                </div>
                {admin.role === "god" && (
                  <button
                    onClick={() => handleDeleteClick(applicant.id, "avyukt")}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete Application"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                )}
              </div>
              
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-bold text-green-300">Email:</span>{" "}
                  <a href={`mailto:${applicant.email}`} className="text-green-400 hover:text-green-200">
                    {applicant.email}
                  </a>
                </p>
                <p>
                  <span className="font-bold text-green-300">Course:</span>{" "}
                  <span className="text-green-200">{applicant.course} — {applicant.current_year}</span>
                </p>
                <p>
                  <span className="font-bold text-green-300">Phone:</span>{" "}
                  <a href={`tel:${applicant.phone_no}`} className="text-green-400 hover:text-green-200">
                    {applicant.phone_no}
                  </a>
                </p>
                <p>
                  <span className="font-bold text-green-300">Why Join:</span>{" "}
                  <span className="text-green-200">{applicant.why_join}</span>
                </p>
                {applicant.tech_skills && (
                  <p>
                    <span className="font-bold text-green-300">Tech Skills:</span>{" "}
                    <span className="text-green-200">{applicant.tech_skills}</span>
                  </p>
                )}
                {applicant.project_interest && (
                  <p>
                    <span className="font-bold text-green-300">Project Interest:</span>{" "}
                    <span className="text-green-200">{applicant.project_interest}</span>
                  </p>
                )}
                {applicant.weekly_time && (
                  <p>
                    <span className="font-bold text-green-300">Weekly Time:</span>{" "}
                    <span className="text-green-200">{applicant.weekly_time}</span>
                  </p>
                )}
                {applicant.project_link && (
                  <p>
                    <span className="font-bold text-green-300">Project Link:</span>{" "}
                    <a 
                      href={applicant.project_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 underline hover:text-green-200"
                    >
                      🔗 View Project
                    </a>
                  </p>
                )}
                <p className="text-xs text-green-500 mt-3">
                  Applied: {new Date(applicant.created_at).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-black border border-red-500 p-6 rounded-lg max-w-md w-full mx-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-2xl text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Confirm Deletion</h3>
            </div>
            
            <p className="text-green-300 mb-6">
              Are you sure you want to delete this {deleteType === "admin" ? "admin" : "application"}? 
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setDeleteType(null);
                }}
                className="flex-1 px-4 py-2 border border-green-500 text-green-400 rounded hover:bg-green-500 hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteType === "admin") {
                    deleteAdmin(showDeleteConfirm);
                  } else if (deleteType === "application") {
                    deleteApplication(showDeleteConfirm);
                  } else if (deleteType === "avyukt") {
                    deleteAvyuktApplication(showDeleteConfirm);
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
