"use client";
import React, { useEffect, useState } from "react";
import "./ogloszeniaStyle.css";
import Image from "next/image";
export default function Ogloszenia() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/db");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const Ogloszenia1 = () => {
    return data.map((item) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()}.${
        date.getMonth() + 1
      }.${date.getFullYear()}`;

      return (
        <div
          key={item.id}
          className="ogloszenie p-5 m-5 flex flex-col text-center justify-between"
        >
          <div className="p-2">
            <p className="title font-bold">{item.title}</p>
            <p className="description">{item.description}</p>
          </div>

          <Image
            src={
              item.image_url == null ? "/images/question.jpg" : item.image_url
            }
            alt="zdjecie ogloszenia"
            width={500}
            height={500}
            className={"image " + item.id}
          />
          <p>{formattedDate}</p>
        </div>
      );
    });
  };

  return (
    <main>
      <h1 className="font-black text-5xl p-5">Ogloszenia</h1>
      <div className="ogloszenia flex flex-row flex-wrap  justify-center">
        {" "}
        <Ogloszenia1 />
      </div>
    </main>
  );
}
