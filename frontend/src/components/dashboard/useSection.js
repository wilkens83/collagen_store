import { useEffect, useState } from "react";
import { api } from "../../lib/api";

// Fetches a dashboard section endpoint and tracks loading/error.
export default function useSection(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let on = true;
    setLoading(true);
    api
      .get(path)
      .then(({ data }) => {
        if (on) {
          setData(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (on) setError(e.response?.data?.detail || e.message || "Failed to load");
      })
      .finally(() => {
        if (on) setLoading(false);
      });
    return () => {
      on = false;
    };
  }, [path]);

  return { data, loading, error };
}
