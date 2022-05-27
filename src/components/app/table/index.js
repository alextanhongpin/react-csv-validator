import styles from "./index.module.css";

export function Table({
  show = true,
  header = [],
  body = [],
  limit = body.length,
}) {
  if (!show) return null;

  const label = body.length === 1 ? "row" : "rows";
  return (
    <>
      <p>
        Showing {limit.toLocaleString()} of {body.length.toLocaleString()}{" "}
        {label} rows
      </p>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {header.map((col) => (
              <th className={styles.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {body.slice(0, limit).map((row) => (
            <tr className={styles.tr}>
              {Object.values(row).map((col) => (
                <td className={styles.th}>{col.toString()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
