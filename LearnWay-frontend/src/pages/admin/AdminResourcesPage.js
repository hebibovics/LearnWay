import React, { useState, useEffect } from "react";
import axios from "axios";
/*
*OVO JA SEBI DA IMAM
* MySQL Enterprise – 2025-12-31 – 500 €

AWS Cloud Hosting – N/A – 1000 €

Adobe Sign – 2025-12-31 – 1000 €
* */
const AdminResourcesPage = () => {
    const [resources, setResources] = useState([]);
    const [newResource, setNewResource] = useState({ name: "", licenseExpiry: "", maintenanceCost: "" });
    const [editingResource, setEditingResource] = useState(null);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        const res = await axios.get("http://localhost:8081/api/resources");
        setResources(res.data);
    };

    const handleAdd = async () => {
        if (!newResource.name) return;
        await axios.post("http://localhost:8081/api/resources", {
            ...newResource,
            maintenanceCost: parseFloat(newResource.maintenanceCost) || 0,
        });
        setNewResource({ name: "", licenseExpiry: "", maintenanceCost: "" });
        fetchResources();
    };

    const handleUpdate = async (id) => {
        await axios.put(`http://localhost:8081/api/resources/${id}`, {
            ...editingResource,
            maintenanceCost: parseFloat(editingResource.maintenanceCost) || 0,
        });
        setEditingResource(null);
        fetchResources();
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ marginBottom: "20px" }}>Digital Resources</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: "20px",
                }}
            >
                {resources.map((res) => (
                    <div
                        key={res.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "10px",
                            padding: "15px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        {editingResource?.id === res.id ? (
                            <>
                                <input
                                    placeholder="Resource Name"
                                    value={editingResource.name}
                                    onChange={(e) => setEditingResource({ ...editingResource, name: e.target.value })}
                                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                                />
                                <input
                                    type="date"
                                    value={editingResource.licenseExpiry}
                                    onChange={(e) => setEditingResource({ ...editingResource, licenseExpiry: e.target.value })}
                                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                                />
                                <input
                                    type="number"
                                    placeholder="Maintenance Cost"
                                    value={editingResource.maintenanceCost}
                                    onChange={(e) => setEditingResource({ ...editingResource, maintenanceCost: e.target.value })}
                                    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                                />
                                <button
                                    onClick={() => handleUpdate(res.id)}
                                    style={{
                                        backgroundColor: "#1b263b",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: "10px" }}>{res.name}</h3>
                                <p>
                                    <strong>License Expiry:</strong> {res.licenseExpiry || "-"}
                                </p>
                                <p>
                                    <strong>Maintenance (€):</strong> {res.maintenanceCost || "-"}
                                </p>
                                <button
                                    onClick={() => setEditingResource(res)}
                                    style={{
                                        backgroundColor: "#3498db",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: "30px" }}>
                <h3>Add New Resource</h3>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "10px",
                        marginTop: "10px",
                    }}
                >
                    <input
                        placeholder="Name"
                        value={newResource.name}
                        onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                        style={{ padding: "10px", flex: "1 1 200px" }}
                    />
                    <input
                        type="date"
                        placeholder="License Expiry"
                        value={newResource.licenseExpiry}
                        onChange={(e) => setNewResource({ ...newResource, licenseExpiry: e.target.value })}
                        style={{ padding: "10px", flex: "1 1 150px" }}
                    />
                    <input
                        type="number"
                        placeholder="Maintenance Cost"
                        value={newResource.maintenanceCost}
                        onChange={(e) => setNewResource({ ...newResource, maintenanceCost: e.target.value })}
                        style={{ padding: "10px", flex: "1 1 150px" }}
                    />
                    <button
                        onClick={handleAdd}
                        style={{
                            backgroundColor: "lightskyblue",
                            color: "black",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminResourcesPage;
