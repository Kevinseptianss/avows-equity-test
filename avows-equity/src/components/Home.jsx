import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useAuth(); // Get the logout function from the useAuth hook
  const [employees, setEmployees] = useState([]); // State to hold employee data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("accessToken"); // Retrieve the access token from localStorage

      try {
        const response = await fetch(
          `${import.meta.env.VITE_URL_API}/list_employee`,
          {
            method: "GET", // Use GET method to fetch data
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the Bearer token in the Authorization header
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setEmployees(data.data.data); // Assuming the API returns an array of employees
      } catch (error) {
        setError(error.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleUpload = () => {
    navigate("/upload");
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">Employee Table</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Upload CSV
          </button>
          <button
            onClick={logout}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Employee ID</th>
            <th className="py-2 px-4 border-b">Employee Name</th>
            <th className="py-2 px-4 border-b">Manager Name</th>
            <th className="py-2 px-4 border-b">Path Level</th>
            <th className="py-2 px-4 border-b">Employee Format</th>
            <th className="py-2 px-4 border-b">Path Hierarchy</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.employee_id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{employee.employee_id}</td>
              <td className="py-2 px-4 border-b">{employee.employee_name}</td>
              <td className="py-2 px-4 border-b">{employee.manager_name}</td>
              <td className="py-2 px-4 border-b">{employee.path_level}</td>
              <td className="py-2 px-4 border-b">{employee.employee_format}</td>
              <td className="py-2 px-4 border-b">{employee.path_hierarchy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
