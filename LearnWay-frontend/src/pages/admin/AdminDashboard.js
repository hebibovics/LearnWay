import React, { useEffect, useState } from "react";
import axios from "axios";
import swal from "sweetalert";

const AdminDashboard = () => {
    const [topCourses, setTopCourses] = useState([]);
    const [status, setStatus] = useState({ backend: false, database: false });
    const [onlineCount, setOnlineCount] = useState(0);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newRisk, setNewRisk] = useState("");
    const [newMitigation, setNewMitigation] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("jwtToken")?.replace(/"/g, "");
    let userId = null;
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub || payload.userId;
    }

    const headers = { Authorization: `Bearer ${token}` };
    console.log("OVO MI JE TOKENTOKENTOKEN", token)

    // 🔹 Fetch Top Courses
    useEffect(() => {
        axios.get("http://localhost:8081/api/course/", { headers })
            .then(res => {
                const coursesWithAvgRate = res.data.map(course => {
                    const reviews = course.reviews || [];
                    const avgRate = reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rate, 0) / reviews.length
                        : 0;
                    return { ...course, avgRate };
                });
                const sorted = coursesWithAvgRate.sort((a, b) => b.avgRate - a.avgRate).slice(0, 5);
                setTopCourses(sorted);
            })
            .catch(err => console.error(err));

        axios.get("http://localhost:8081/api/status", { headers })
            .then(res => setStatus(res.data))
            .catch(() => setStatus({ backend: false, database: false }));
    }, []);

    // 🔹 Track Active Users
    useEffect(() => {
        const interval = setInterval(() => {
            fetch("/api/active", { method: "POST", headers: { "user-id": userId } });
        }, 10000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        const countInterval = setInterval(() => {
            fetch("/api/active-count")
                .then(res => res.json())
                .then(count => setOnlineCount(count));
        }, 5000);
        return () => clearInterval(countInterval);
    }, []);

    // 🔹 Fetch Strategic Goals
    const fetchGoals = async () => {
        try {
            const token = localStorage.getItem("jwtToken")?.replace(/"/g, "");

            const res = await axios.get("http://localhost:8081/api/strategy-goals", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        fetchGoals();
    }, []);

    // 🔹 Add new Goal
    const handleAddGoal = async () => {
        if (!newGoal.trim() || !newDescription.trim() || !newRisk.trim() || !newMitigation.trim()) {
            swal("⚠️ Warning", "Please fill in all fields (Goal, Description, Risk, Mitigation).", "warning");
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:8081/api/strategy-goals", {
                text: newGoal,
                description: newDescription,
                risk: newRisk,
                mitigation: newMitigation
            }, {
                headers: { Authorization: `Bearer ${token}` },
            })

            swal("Success!", "Strategic goal added successfully.", "success");
            setNewGoal("");
            setNewDescription("");
            setNewRisk("");
            setNewMitigation("");
            fetchGoals();
        } catch (err) {
            swal("Error!", "Could not add the goal.", "error");
        } finally {
            setLoading(false);
        }
    };

    // 🔹 Delete Goal
    const handleDeleteGoal = async (id) => {
        const confirm = await swal({
            title: "Are you sure?",
            text: "This goal will be permanently deleted.",
            icon: "warning",
            buttons: ["Cancel", "Yes, delete"],
            dangerMode: true,
        });

        if (confirm) {
            try {
                await axios.delete(`http://localhost:8081/api/strategy-goals/${id}`, { headers });
                swal("🗑️ Success!", "Goal deleted successfully.", "success");
                fetchGoals();
            } catch (err) {
                swal("❌ Error!", "Could not delete the goal.", "error");
            }
        }
    };

    const releaseNotes = [
        { version: "v1.0", description: "Added certificates feature" },
        { version: "v1.3", description: "Added quiz results overview" },
    ];
    const [ciData, setCiData] = useState([]);
    useEffect(() => {
        const fetchCI = async () => {
            try {
                // Dohvati token iz localStorage
                const token = localStorage.getItem("jwtToken")?.replace(/"/g, "");

                // Helper funkcija za GET s tokenom
                const fetchWithToken = (url) =>
                    axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

                // Dohvati sve podatke
                const [usersRes, coursesRes, lessonsRes, quizzesRes, licensesRes] = await Promise.all([
                    fetchWithToken("http://localhost:8081/api/users"),
                    fetchWithToken("http://localhost:8081/api/course/"),
                    fetchWithToken("http://localhost:8081/api/lesson/"),
                    fetchWithToken("http://localhost:8081/api/quiz/"),
                    fetchWithToken("http://localhost:8081/api/resources"),
                ]);

                // Pripremi podatke za tabelu
                const users = usersRes.data;
                const courses = coursesRes.data;
                const lessons = lessonsRes.data;
                const quizzes = quizzesRes.data;
                const licenses = licensesRes.data;

                const students = users.filter(u => u.role === "STUDENT").length;
                const instructors = users.filter(u => u.role === "INSTRUCTOR").length;
                const today = new Date();
                const expiredLicenses = licenses.filter(l => {
                    const expiryDate = new Date(l.licenseExpiry);
                    return expiryDate < today;
                }).length;

                const activeLicenses = licenses.length - expiredLicenses;

                const tableData = [
                    { type: "Users", count: `${users.length} (${students} students, ${instructors} instructors)`, note: "Active users and roles" },
                    { type: "Courses", count: courses.length, note: "Active courses" },
                    { type: "Lessons", count: lessons.length, note: "Total lessons" },
                    { type: "Quizzes", count: quizzes.length, note: "Total quizzes" },
                    { type: "Licenses", count: `${licenses.length} (${expiredLicenses} expired, ${activeLicenses} active)`, note: "AWS, MySQL, Adobe Sign" },
                ];

                setCiData(tableData);
            } catch (err) {
                console.error("Error fetching CI data:", err);
            }
        };

        fetchCI();
    }, []);

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>⭐</span> Top 5 Courses
            </h2>

            <div style={{ color: "black", display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
                {topCourses.map((course, index) => (
                    <div key={course.courseId} style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "15px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        backgroundColor: "#f9f9f9",
                    }}>
                        <div>
                            <h3 style={{ margin: "0 0 5px 0" }}>
                                {index + 1}. {course.title} <span style={{ color: "#f1c40f", marginLeft: "5px" }}>⭐</span>
                            </h3>
                            <p style={{ margin: "2px 0", fontSize: "14px", color: "#555" }}>
                                Category: {course.category?.title || "N/A"} | Instructor: {course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : "N/A"}
                            </p>
                        </div>
                        <div style={{ fontWeight: "bold", color: "#1b263b" }}>
                            {(course.avgRate || 0).toFixed(1)}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "40px" }}>
                <h2>Service Status</h2>
                <ul>
                    <li>Backend: {status.backend ? "✅" : "❌"}</li>
                    <li>Database: {status.database ? "✅" : "❌"}</li>
                </ul>
            </div>

            <div style={{ marginTop: "40px" }}>
                <h2>Currently Active Users:</h2>
                <h2 style={{ color: "white" }}>{onlineCount}</h2>
            </div>

            <div style={{ marginTop: "40px" }}>
                <h2>Strategic Goals</h2>
                <p style={{ color: "#555" }}>Add, view, and archive strategic goals.</p>

                {/* Input Fields Side by Side */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Goal title..."
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Description..."
                        style={{ flex: 2, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        value={newRisk}
                        onChange={(e) => setNewRisk(e.target.value)}
                        placeholder="Risk..."
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                    <input
                        type="text"
                        value={newMitigation}
                        onChange={(e) => setNewMitigation(e.target.value)}
                        placeholder="Mitigation..."
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                    <button
                        onClick={handleAddGoal}
                        disabled={loading}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: loading ? "#ccc" : "#1b263b",
                            color: "white",
                            cursor: "pointer",
                        }}
                    >
                        {loading ? "Adding..." : "Add Goal"}
                    </button>
                </div>

                {/* Display Goals */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {goals.length === 0 ? (
                        <p style={{ color: "#777" }}>No strategic goals found.</p>
                    ) : (
                        goals.map(goal => (
                            <div key={goal.id} style={{
                                padding: "10px",
                                borderRadius: "6px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                backgroundColor: "#f0f8ff",
                                color: "black",
                                display: "flex",
                                flexDirection: "column",
                                gap: "3px",
                                fontSize: "14px"
                            }}>
                                <strong>{goal.text}</strong>
                                <span>{goal.description}</span>
                                <span><strong>Risk:</strong> {goal.risk}</span>
                                <span><strong>Mitigation:</strong> {goal.mitigation}</span>
                                <button
                                    onClick={() => handleDeleteGoal(goal.id)}
                                    style={{
                                        alignSelf: "flex-end",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "4px",
                                        padding: "4px 8px",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Archive
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>


            <div style={{ marginTop: "40px" }}>
                <h2>Release Notes</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {releaseNotes.map((note, idx) => (
                        <div key={idx} style={{
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            backgroundColor: "#fff3e0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            color: "#1b263b"
                        }}>
                            <span>
                                <strong>{note.version}:</strong> {note.description}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <h2 style={{ marginTop: "40px" }}>CI</h2>
            <table className="table" style={{ color: "white" }}>
                <thead>
                <tr>
                    <th>CI Type</th>
                    <th>Count / Status</th>
                    <th>Note</th>
                </tr>
                </thead>
                <tbody>
                {ciData.map((ci, index) => (
                    <tr key={index}>
                        <td>{ci.type}</td>
                        <td>{ci.count}</td>
                        <td>{ci.note}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
