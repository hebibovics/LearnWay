import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [topCourses, setTopCourses] = useState([]);
    const [status, setStatus] = useState({ backend: false, database: false });
    const [onlineCount, setOnlineCount] = useState(0);
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState("");

    const token = localStorage.getItem("token");
    let userId = null;
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub || payload.userId;
    }

    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        fetch("api/course/", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const coursesWithAvgRate = data.map(course => {
                    const reviews = course.reviews || [];
                    const avgRate = reviews.length > 0
                        ? reviews.reduce((sum, r) => sum + r.rate, 0) / reviews.length
                        : 0;
                    return { ...course, avgRate };
                });

                const sorted = coursesWithAvgRate
                    .sort((a, b) => b.avgRate - a.avgRate)
                    .slice(0, 5);

                setTopCourses(sorted);
            })
            .catch(err => console.error(err));

        fetch("api/status")
            .then(res => res.json())
            .then(data => setStatus(data))
            .catch(() => setStatus({ backend: false, database: false }));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("/api/active", {
                method: "POST",
                headers: { "user-id": userId },
            });
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

    const addGoal = () => {
        if (newGoal.trim() === "") return;
        const goalObj = { id: Date.now(), text: newGoal };
        setGoals([...goals, goalObj]);
        setNewGoal("");
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };
    const releaseNotes = [
        { version: "v1.0", description: "Added certificates feature" },
        { version: "v1.3", description: "Added quiz results overview" },
    ];
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>⭐</span> Top 5 Courses
            </h2>

            <div style={{ color:"black", display: "flex", flexDirection: "column", gap: "15px", marginTop: "20px" }}>
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
                <h2>Currently Active Users: </h2>
                <h2 style={{ color: "white" }}>{onlineCount}</h2>
            </div>

            <div style={{ marginTop: "40px" }}>
                <h2>Strategic Goals</h2>
                <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter new goal..."
                        style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    />
                    <button
                        onClick={addGoal}
                        style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#1b263b", color: "white", cursor: "pointer" }}
                    >
                        Add
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {goals.map(goal => (
                        <div key={goal.id} style={{
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                            backgroundColor: "#f0f8ff",
                            color: "black",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <span>{goal.text}</span>
                            <button
                                onClick={() => deleteGoal(goal.id)}
                                style={{ background: "red", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px", cursor: "pointer" }}
                            >
                                Archive
                            </button>
                        </div>
                    ))}
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



        </div>
    );
};

export default AdminDashboard;
