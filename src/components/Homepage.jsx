import React, { useEffect, useState } from "react";

const url = "http://localhost:8000/";
const Homepage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);
  return <div>Homepage</div>;
};

export default Homepage;
