const Table = ({ headers, data }) => (
  <table className="w-full bg-white">
    <thead className="bg-blue-600 text-white">
      <tr>
        {headers.map(h => <th key={h} className="p-2">{h}</th>)}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i} className="border">
          {Object.values(row).map((v, j) => (
            <td key={j} className="p-2">{v}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table;
