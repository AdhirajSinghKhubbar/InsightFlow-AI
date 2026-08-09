import { createContext, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState("");
  const [datasetId, setDatasetId] = useState(null);

  return (
    <DataContext.Provider
      value={{
        csvData,
        setCsvData,
        fileName,
        setFileName,
        datasetId,
        setDatasetId,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}