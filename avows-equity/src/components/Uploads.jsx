import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const formData = new FormData();
      formData.append('file', file);
      const accessToken = localStorage.getItem('accessToken');
      fetch(`${import.meta.env.VITE_URL_API}/post_data`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${accessToken}`, // Add the Authorization header
        },
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.data);
          if (data.data) {
            setData(data.data);
            setError(null);
          } else {
            setError('Failed to fetch data');
          }
        })
        .catch((err) => {
          setError('Error: ' + err.message);
        });
    } else {
      setError('Please select a valid CSV file.');
    }
  };

  const handleGoBack = () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upload CSV File</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleGoBack}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go Back Home
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && (
        <div className="mt-8 w-full max-w-4xl">
          {/* Log Transaksi Table */}
          <h2 className="text-xl font-semibold mb-4">Log Transaksi</h2>
          <table className="min-w-full bg-white border border-gray-300 mb-8">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Employee ID</th>
                <th className="py-2 px-4 border-b">Transaction Amount</th>
                <th className="py-2 px-4 border-b">Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {data.logTransaksi.map((transaction) => (
                <tr key={transaction.employee_id}>
                  <td className="py-2 px-4 border-b">{transaction.employee_id}</td>
                  <td className="py-2 px-4 border-b">{transaction.amount}</td>
                  <td className="py-2 px-4 border-b">{transaction.tgl_transaksi}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Log Fee Table */}
          <h2 className="text-xl font-semibold mb-4">Log Fee</h2>
          <table className="min-w-full bg-white border border-gray-300 mb-8">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Employee ID</th>
                <th className="py-2 px-4 border-b">Fee Amount</th>
                <th className="py-2 px-4 border-b">Fee Date</th>
              </tr>
            </thead>
            <tbody>
              {data.logFee.map((fee) => (
                <tr key={fee.employee_id}>
                  <td className="py-2 px-4 border-b">{fee.employee_id}</td>
                  <td className="py-2 px-4 border-b">{fee.amount_fee}</td>
                  <td className="py-2 px-4 border-b">{fee.tgl_fee}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Log Summary Table */}
          <h2 className="text-xl font-semibold mb-4">Log Summary</h2>
          <table className="min-w-full bg-white border border-gray-300 mb-8">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">CSV Filename</th>
                <th className="py-2 px-4 border-b">Total Records</th>
                <th className="py-2 px-4 border-b">Total Records Success</th>
                <th className="py-2 px-4 border-b">Total Records Failed</th>
                <th className="py-2 px-4 border-b">Failed Notes</th>
                <th className="py-2 px-4 border-b">Upload Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">{data.log.csv_filename}</td>
                <td className="py-2 px-4 border-b">{data.log.total_record}</td>
                <td className="py-2 px-4 border-b">{data.log.total_record_success}</td>
                <td className="py-2 px-4 border-b">{data.log.total_record_failed}</td>
                <td className="py-2 px-4 border-b">{data.log.failed_notes}</td>
                <td className="py-2 px-4 border-b">{new Date(data.log.upload_date).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileUpload;