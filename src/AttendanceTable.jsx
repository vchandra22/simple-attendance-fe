import { useState, useEffect } from "react";
import axios from "axios";

const AttendanceTable = () => {
    const [attendances, setAttendances] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        totalPages: 1,
        totalItems: 0,
    });

    // Fetch data with page parameter
    const fetchData = async (page = pagination.page) => {
        try {
            const response = await axios.get(
                `http://localhost:8088/api/v1/attendances?page=${page}&size=${pagination.size}`
            );

            const data = response.data;
            if (data && Array.isArray(data.data)) {
                setAttendances(data.data);
                setPagination({
                    page: data.paging.page,
                    size: data.paging.size,
                    totalPages: data.paging.totalPage,
                    totalItems: data.paging.totalItems,
                });
                setPaginatedData(data.data);
            } else {
                setError("Invalid data format");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching attendance data:", err);
            if (err.response) {
                setError(`Error: ${err.response.data.message || "Failed to fetch attendance data"}`);
            } else if (err.request) {
                setError("Error: No response received from the server.");
            } else {
                setError(`Error: ${err.message}`);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(pagination.page);
    }, [pagination.page, pagination.size, attendances]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination((prevState) => ({
                ...prevState,
                page: newPage,
            }));
        }
    };

    const handleEdit = (id) => {
        const attendanceToEdit = attendances.find((attendance) => attendance.id === id);
        setSelectedAttendance(attendanceToEdit);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSave = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await axios.put(
                `http://localhost:8088/api/v1/attendances/${selectedAttendance.id}`,
                selectedAttendance
            );

            if (response.status === 200) {
                // Successfully updated attendance
                setAttendances((prevAttendances) =>
                    prevAttendances.map((attendance) =>
                        attendance.id === selectedAttendance.id ? selectedAttendance : attendance
                    )
                );
                setShowModal(false);
            } else {
                setError("Failed to update attendance.");
            }
        } catch (err) {
            console.error("Error updating attendance:", err);
            setError(err.response?.data?.message || "Failed to update attendance");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this attendance record?")) {
            try {
                await axios.delete(`http://localhost:8088/api/v1/attendances/${id}`);
                fetchData(pagination.page);
            } catch (err) {
                console.error("Error deleting attendance:", err);
                setError("Failed to delete attendance record.");
            }
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center" }}>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2>Daftar Kehadiran</h2>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "20px",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>No.</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Nama Karyawan</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tanggal</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((attendance, index) => (
                        <tr key={attendance.id} style={{ textAlign: "center" }}>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {((pagination.page - 1) * pagination.size) + (index + 1)}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {attendance.employeeName}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {attendance.date}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                {attendance.status}
                            </td>
                            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                <a
                                    href="#"
                                    style={{ color: "blue" }}
                                    onClick={() => handleEdit(attendance.id)}
                                >
                                    Edit
                                </a> | <button
                                    style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}
                                    onClick={() => handleDelete(attendance.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    style={{ marginRight: "10px" }}
                >
                    Previous
                </button>
                <span>
                    Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    style={{ marginLeft: "10px" }}
                >
                    Next
                </button>
            </div>

            {showModal && selectedAttendance && (
                <div style={{ position: "fixed", top: "0", left: "0", right: "0", bottom: "0", background: "rgba(0,0,0,0.5)" }}>
                    <div style={{ padding: "20px" }}>
                        <form
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                                padding: "20px",
                                background: "#f9f9f9",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                width: "500px",
                                margin: "auto",
                            }}
                        >
                            <h3>Edit Kehadiran</h3>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "14px", color: "#333" }}>
                                Employee Name:
                                <input
                                    type="text"
                                    value={selectedAttendance.employeeName}
                                    onChange={(e) =>
                                        setSelectedAttendance({
                                            ...selectedAttendance,
                                            employeeName: e.target.value,
                                        })
                                    }
                                    style={{
                                        marginTop: "8px",
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                    }}
                                />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "14px", color: "#333" }}>
                                Date:
                                <input
                                    type="date"
                                    value={selectedAttendance.date}
                                    onChange={(e) =>
                                        setSelectedAttendance({
                                            ...selectedAttendance,
                                            date: e.target.value,
                                        })
                                    }
                                    style={{
                                        marginTop: "8px",
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                    }}
                                />
                            </label>
                            <label style={{ display: "flex", flexDirection: "column", fontSize: "14px", color: "#333" }}>
                                Status:
                                <select
                                    value={selectedAttendance.status}
                                    onChange={(e) =>
                                        setSelectedAttendance({
                                            ...selectedAttendance,
                                            status: e.target.value,
                                        })
                                    }
                                    style={{
                                        marginTop: "8px",
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        fontSize: "14px",
                                        backgroundColor: "#fff",
                                    }}
                                >
                                    <option value="HADIR">HADIR</option>
                                    <option value="IZIN">IZIN</option>
                                    <option value="SAKIT">SAKIT</option>
                                    <option value="TIDAK HADIR">TIDAK HADIR</option>
                                </select>
                            </label>
                            <div style={{ display: "flex", justifyContent: "justify-end", gap: "10px",  }}>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    style={{
                                        padding: "10px 20px",
                                        background: "#007BFF",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: "10px 20px",
                                        background: "#6c757d",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AttendanceTable;
