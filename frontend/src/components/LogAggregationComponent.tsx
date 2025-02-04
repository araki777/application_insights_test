import { useEffect, useState } from "react";
import { getLog } from "../api/api";

const LogAggregationComponent = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logs = await getLog(); // 非同期関数の呼び出し
        setLogs(logs?.tables[0]?.rows); // APIから取得したデータをセット
      } catch (e) {
        console.error("APIエラー:", e);
      }
    };

    fetchLogs(); // 最初にデータを取得
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLogs(data.tables[0].rows);
      } catch (e) {
        console.error("Error parsing data:", e);
      }
    };

    ws.onopen = () => {
      console.log("WebSocket connected successfully");
    }

    ws.onclose = (event) => {
      console.log("WebSocket close: ", event);
    }

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h3>Logs:</h3>
      <table>
        <thead>
          <tr>
            {/* テーブルのヘッダーを動的に生成 */}
            {logs.length > 0 && Object.keys(logs[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index}>
                {/* ログの各データを行として表示 */}
                {Object.values(log).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(logs[0] || {}).length}>No logs available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default LogAggregationComponent