import { useState } from "react";
import axios from "axios";

const AttendanceForm = () => {
    const [formData, setFormData] = useState({
        employeeName: "",
        date: "",
        status: "HADIR",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await axios.post("http://localhost:8088/api/v1/attendances", formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            setSuccess(true);
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("Failed to submit form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
                <h2>Formulir Kehadiran</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label htmlFor="employeeName" style={{ display: "block", marginBottom: "8px" }}>
                            Nama Karyawan
                        </label>
                        <input
                            type="text"
                            id="employeeName"
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                            }}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
                        <div style={{ flex: "1", marginRight: "16px" }}>
                            <label htmlFor="date" style={{ display: "block", marginBottom: "8px" }}>
                                Tanggal
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                                required
                            />
                        </div>

                        <div style={{ flex: "1" }}>
                            <label htmlFor="status" style={{ display: "block", marginBottom: "8px" }}>
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "9px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    backgroundColor: "#ffffff",
                                }}
                                required
                            >
                                <option value="HADIR">HADIR</option>
                                <option value="IZIN">IZIN</option>
                                <option value="SAKIT">SAKIT</option>
                                <option value="TIDAK HADIR">TIDAK HADIR</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={{
                            backgroundColor: loading ? "#ccc" : "#4CAF50",
                            color: "white",
                            padding: "10px 16px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>

                    {success && <p style={{ color: "green", marginTop: "16px" }}>Form submitted successfully!</p>}
                    {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
                </form>
            </div>
    );
};

export default AttendanceForm;
