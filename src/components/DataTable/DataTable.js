import { useState, useMemo } from "react";
import PropTypes from "prop-types";

import "./DataTable.scss";

export default function DataTable({
  columns,
  data,
  loading,
  title,
  subtitle,
  row_click,
  customBtns,
  rows_per_page_default,
  hide_rows_per_page,
}) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [rows_per_page, set_rows_per_page] = useState(
    rows_per_page_default || 50
  );

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!sortedData) return;
    if (hide_rows_per_page) {
      return sortedData;
    } else {
      return sortedData.slice(0, rows_per_page);
    }
  }, [sortedData, rows_per_page, hide_rows_per_page]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatCell = (value, col) => {
    if (col.type === "part") {
      const words = value.split(" ");
      if (words.length > 10) {
        return words.slice(0, 10).join(" ") + "...";
      }
    }
    return value;
  };

  let rows_options = [];
  if (data) {
    rows_options = [5, 10, 20, 50, 100].filter((num) => num < data.length);
    if (!rows_options.includes(data.length)) rows_options.push(data.length);
  }

  return (
    <div className="datatable_root">
      <div className="datatable_header">
        <div className="title_container">
          <h2 className="title"> {title} </h2>
          <p className="subtitle">{subtitle} </p>
          {paginatedData && !hide_rows_per_page ? (
            <div className="rows_info">
              <p className="subtitle">
                Visible rows: {paginatedData.length} / Total rows:{" "}
                {data && data.length}
              </p>
              <select
                value={rows_per_page}
                onChange={(e) => set_rows_per_page(Number(e.target.value))}
                className="rows_select"
              >
                {rows_options.map((num) => (
                  <option key={num} value={num}>
                    {num === data.length ? "All" : `Show ${num}`}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="d-flex">
          {customBtns &&
            customBtns
              .filter((ele) => !ele.hide)
              .map((btn) => (
                <button
                  className={`${btn.class} ${loading ? "loading" : ""}`}
                  key={btn.key}
                  onClick={loading ? () => {} : () => btn.onClick()}
                >
                  {btn.icon} {btn.label}{" "}
                </button>
              ))}

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="datatable_search"
          />
        </div>
      </div>
      <div className="datatable_wrapper">
        <table className="datatable_table">
          <thead>
            <tr>
              {columns
                .filter((col) => !col.hide)
                .map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className={`${
                      sortConfig.key === col.field ? "sorted" : ""
                    }`}
                    style={{ width: col.width ? col.width : "" }}
                  >
                    {col.label}
                    {sortConfig.key === col.field && (
                      <span className="sort_arrow">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.filter((col) => !col.hide).length}
                  className="loading_cell"
                >
                  <div className="spinner"></div>
                </td>
              </tr>
            ) : paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`${
                    typeof row_click === "function" ? "clickable" : ""
                  }  ${row.active ? "active" : ""}`}
                  onClick={
                    typeof row_click === "function"
                      ? () => row_click(row)
                      : () => {}
                  }
                >
                  {columns
                    .filter((col) => !col.hide)
                    .map((col) => (
                      <td
                        key={col.field}
                        style={{
                          width: col.width ? col.width : "",
                          cursor:
                            col.type === "part" &&
                            typeof col.click === "function"
                              ? "pointer"
                              : "",
                        }}
                        onClick={
                          typeof col.click === "function"
                            ? () => col.click(row)
                            : () => {}
                        }
                      >
                        {formatCell(row[col.field], col)}
                      </td>
                    ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.filter((col) => !col.hide).length}
                  className="no_data"
                >
                  No matching data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.prototype = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      width: PropTypes.string,
      hide: PropTypes.bool,
      type: PropTypes.oneOf(["part", null]),
      click: PropTypes.func,
    })
  ).isRequired,

  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  row_click: PropTypes.func,

  customBtns: PropTypes.arrayOf(
    PropTypes.shape({
      hide: PropTypes.bool,
      class: PropTypes.string,
      key: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.node,
      label: PropTypes.string,
    })
  ),
  rows_per_page_default: PropTypes.number,
};

DataTable.defaultProps = {
  data: null,
  loading: false,
  title: "",
  subtitle: "",
  row_click: null,
  customBtns: null,
  rows_per_page_default: 50,
};
