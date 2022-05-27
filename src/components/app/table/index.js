import styles from "./index.module.css";
import { useState, useMemo } from "react";

const PER_PAGE = [10, 25, 50, 100];

export function Table({
  show = true,
  header = [],
  body = [],
  limit: limitInput = 10,
}) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(limitInput);

  const { hasNext, hasPrev, start, end, paginate, firstPage, lastPage } =
    useMemo(() => {
      const count = page * limit;
      return {
        hasNext: count < body.length,
        hasPrev: page > 1,
        start: (page - 1) * limit,
        end: Math.min(page * limit, body.length),
        paginate: body.length > limit,
        firstPage: 1,
        lastPage: Math.ceil(body.length / limit),
      };
    }, [body, limit, page]);

  const handleNextPage = () => setPage((page) => Math.min(page + 1, lastPage));
  const handlePrevPage = () => setPage((page) => Math.max(page - 1, firstPage));
  const handleReset = () => setPage(1);
  const handleChangePage = (evt) => {
    const page = evt.currentTarget.valueAsNumber;
    setPage(
      Math.max(firstPage, Math.min(isNaN(page) ? firstPage : page, lastPage))
    );
  };
  const handleSelectLimit = (evt) => {
    const limit = Number(evt.currentTarget.value);
    setLimit(isNaN(limit) ? limitInput : limit);
  };

  const label = body.length === 1 ? "row" : "rows";

  if (!show) return null;

  return (
    <>
      <p>
        Showing {start.toLocaleString()}-{end.toLocaleString()} of{" "}
        {body.length.toLocaleString()} {label} rows
      </p>

      {paginate && (
        <>
          <button disabled={!hasPrev} onClick={handlePrevPage}>
            Prev
          </button>
          <input type="number" value={page} onChange={handleChangePage} /> /{" "}
          {lastPage}
          <button disabled={!hasNext} onClick={handleNextPage}>
            Next
          </button>
          <button onClick={handleReset}>Reset</button>
          <select onChange={handleSelectLimit} value={limit.toString()}>
            {PER_PAGE.map((limit) => (
              <option value={limit}>{limit}</option>
            ))}
          </select>
        </>
      )}

      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {header.map((col) => (
              <th className={styles.th} key={col}>
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={styles.tbody}>
          {body.slice(start, end).map((row, rowIndex) => (
            <tr className={styles.tr} key={rowIndex}>
              {Object.values(row).map((col, colIndex) => (
                <td key={colIndex} className={styles.th}>
                  {col.toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
