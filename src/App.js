import { useState } from "react";
import { CourseCsvValidator, useCsv } from "ports/csv";
import { Table } from "components/app";
import styles from "./App.module.css";

function App() {
  const [file, setFile] = useState();

  const handleChange = (evt) => {
    const file = evt.target.files[0];
    setFile(file);
  };

  const { error, result, header } = useCsv(CourseCsvValidator, file);

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

      <Table show={result.length} header={header} body={result} />
    </div>
  );
}

export default App;
