import { useState, useEffect } from "react";
import axios from "axios";

const AttendanceTable = () => {
    const [attendances, setAttendances] = useState([]);
    const [paginatedData, setPaginatedData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Employee Name</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
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
        </div>
    );
};

export default AttendanceTable;
