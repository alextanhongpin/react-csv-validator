import { useState, useEffect } from "react";
import { CourseCsvValidator, CsvRowError } from "ports/csv";
import { AggregateError } from "ports/error";
import { Table } from "components/app";
import styles from "./App.module.css";

function App() {
  const [file, setFile] = useState();
  const [result, setResult] = useState([]);
  const [error, setError] = useState();
  const [errorRows, setErrorRows] = useState([]);

  const handleChange = (evt) => {
    const file = evt.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    if (!file) return;

    async function parse() {
      // Clear previous errors.
      setResult([]);
      setError();
      setErrorRows([]);

      try {
        const result = await CourseCsvValidator.fromCSV(file);
        setResult(result);
      } catch (error) {
        if (error instanceof AggregateError) {
          const message = [
            `Found ${error.errors.length} error(s)`,
            ...error.errors.map((error) => error.toString()),
          ];
          setError(message.join("\r\n"));
          setErrorRows(
            error.errors
              .filter((error) => error instanceof CsvRowError)
              .map((error) => ({
                row: error.row,
                ...error.data,
              }))
          );
        } else {
          setError(error.message);
        }
      }
    }
    parse();
  }, [file]);

  return (
    <div className={styles.container}>
      <input type="file" onChange={handleChange} accept=".csv" />
      {file && (
        <div>
          <p>
            <b>Name</b>: {file.name}
          </p>
          <p>
            <b>Size</b>: {(file.size / 1024 / 1024).toLocaleString()} MB
          </p>
          <p>
            <b>Last Modified</b>: {file.lastModifiedDate.toString()}
          </p>
        </div>
      )}

      {error ? <p className={styles.error}>{error}</p> : null}

      <Table
        show={result.length}
        header={CourseCsvValidator.headerFromRow(result?.[0])}
        body={result}
        limit={7}
      />

      <Table
        show={errorRows.length}
        header={CourseCsvValidator.headerFromRow(errorRows?.[0])}
        body={errorRows}
      />
    </div>
  );
}

export default App;
