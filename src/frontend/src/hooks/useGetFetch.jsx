import { useState, useEffect } from "react";
import axios from "axios";

const PREFIX = "http://127.0.0.1:8000/api/v1";

const useGetFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${PREFIX}${url}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading };
}

export default useGetFetch;