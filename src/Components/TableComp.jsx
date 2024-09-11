import React, { useEffect, useState } from "react";
import Pagination from "./PaginationComp";
import "./table.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const TableComp = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage,setrowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [columns, setColumns] = useState(["id", "name", "email"]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showMenu, setShowMenu] = useState(null);



  const handlefetch = async () => {
    try {
      let res = await fetch(API_URL);
      let data = await res.json();
      setTableData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handlefetch();
  }, []);

  const handleColumnSwap = (fromIndex, toIndex) => {
    const updatedColumns = [...columns];
    const temp = updatedColumns[fromIndex];
    updatedColumns[fromIndex] = updatedColumns[toIndex];
    updatedColumns[toIndex] = temp;
    setColumns(updatedColumns);
  };

  const handleSort = (col) => {
    setSortColumn(col);
    setIsAscending(!isAscending);
    const sortedData = [...tableData].sort((a, b) => {
      if (isAscending) {
        return a[col] > b[col] ? 1 : -1;
      } else {
        return a[col] < b[col] ? 1 : -1;
      }
    });
    setTableData(sortedData);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleEdit = (row) => {
    setEditData(row);
    setShowModal(true);
  };

  const saveEdit = () => {
    const updatedData = tableData.map((row) =>
      row.id === editData.id ? editData : row
    );
    setTableData(updatedData);
    setShowModal(false);
    setShowMenu(false);
  };

  const handleDelete = (index) => {
    const updatedData = tableData.filter((da, i) => i !== index);
    setTableData(updatedData);
    setShowModal(false);
    setShowMenu(false);
  };

  const filteredData = tableData.filter((item) =>
    columns.some((col) => String(item[col]).toLowerCase().includes(searchQuery))
  );

  const totalPages = 2

  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage , currentPage * rowsPerPage);

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearch}
        className="inp"
      />

      <table>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col}>
                {col}
                <button onClick={() => handleSort(col)}>
                  {isAscending ? "↑" : "↓"}
                </button>
                {index > 0 && (
                  <button onClick={() => handleColumnSwap(index, index - 1)}>
                    ←
                  </button>
                )}
                {index < columns.length - 1 && (
                  <button onClick={() => handleColumnSwap(index, index + 1)}>
                    →
                  </button>
                )}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col}>{row[col]}</td>
              ))}
              <td>
                <button onClick={() => setShowMenu(rowIndex)}>⋮</button>
                {showMenu === rowIndex && (
                  <div className="menu">
                    <button onClick={() => handleEdit(row)}>Edit</button>
                    <button onClick={() => handleDelete(rowIndex)}>
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <div className="mt">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Row</h3>
            {columns.map((col) => (
              <div key={col}>
                <label>{col}</label>
                <input
                  value={editData[col]}
                  onChange={(e) =>
                    setEditData({ ...editData, [col]: e.target.value })
                  }
                />
              </div>
            ))}
            <button onClick={saveEdit}>Save</button>
            <button
              onClick={() => {
                setShowModal(false);
                setShowMenu(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableComp;
