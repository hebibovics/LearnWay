import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const ServiceDeskPage = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [description, setDescription] = useState("");
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) setUserId(user.userId);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            swal("⚠️ Greška!", "Korisnik nije prijavljen.", "error");
            return;
        }

        const ticketData = {
            title,
            category: subCategory ? `${category} - ${subCategory}` : category,
            description,
        };

        try {
            await axios.post(`http://localhost:8080/api/tickets/${userId}`, ticketData);
            swal("✅ Uspjeh!", "Ticket je poslan.", "success");
            setTitle(""); setCategory(""); setSubCategory(""); setDescription("");
        } catch (err) {
            swal("❌ Greška!", "Došlo je do greške.", "error");
        }
    };

    const subCategories = {
        Greška: ["Problem sa kvizom", "Problem sa lekcijom", "Problem sa loginom", "Drugo"],
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">🎫 Service Desk</h2>
                    <p className="text-gray-500 mt-2">Pošaljite svoj zahtjev ili prijavite problem</p>
                </div>

                {/* Forma */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Naslov */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Naslov ticketa</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Kratak opis problema"
                            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    {/* Kategorija + Podkategorija */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-1">Kategorija</label>
                            <select
                                value={category}
                                onChange={(e) => { setCategory(e.target.value); setSubCategory(""); }}
                                className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
                                required
                            >
                                <option value="">-- Odaberi kategoriju --</option>
                                <option value="Prijedlog za poboljšanje">Prijedlog za poboljšanje</option>
                                <option value="Prijedlog nove kategorije">Prijedlog nove kategorije</option>
                                <option value="Greška">Greška</option>
                            </select>
                        </div>

                        {category === "Greška" && (
                            <div className="flex flex-col">
                                <label className="text-gray-700 font-medium mb-1">Podkategorija</label>
                                <select
                                    value={subCategory}
                                    onChange={(e) => setSubCategory(e.target.value)}
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition"
                                    required
                                >
                                    <option value="">-- Odaberi podkategoriju --</option>
                                    {subCategories["Greška"].map((sub, i) => (
                                        <option key={i} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {/* Opis */}
                    <div className="flex flex-col">
                        <label className="text-gray-700 font-medium mb-1">Opis</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                            placeholder="Detaljno opišite problem ili prijedlog"
                            className="rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            required
                        />
                    </div>

                    {/* Dugme */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-10 py-3 rounded-lg shadow-md transform hover:scale-105 transition"
                        >
                            🚀 Pošalji Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ServiceDeskPage;
