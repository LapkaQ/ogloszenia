"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./ogloszeniaDeleteStyle.css";

export default function OgloszeniaDelete() {
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
  }, [loading]);

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }
  const handleSubmit = async (id) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", id);
      const response = await fetch("/api/delete", {
        method: "POST",
        body: formDataToSend,
      });
      const newData = data.filter((item) => item.id !== id);
      setData(newData);
    } catch (error) {
      setMessage("Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  const Ogloszenia1 = () => {
    return data.map((item) => {
      const date = new Date(item.created_at);
      const formattedDate = `${date.getDate()}.${
        date.getMonth() + 1
      }.${date.getFullYear()}`;

      return (
        <div
          key={item.id}
          className="ogloszenieDelete p-2 m-2 flex flex-row text-center justify-between items-center"
        >
          <Image
            src={
              item.image_url == null ? "/images/question.jpg" : item.image_url
            }
            alt="zdjecie ogloszenia"
            width={200}
            height={200}
            className={"imageDelete " + item.id}
          />
          <div className="grow p-2">
            <p className="titleDelete font-bold">{item.title}</p>
            <p className="descriptionDelete">{item.description}</p>
            <p>{formattedDate}</p>
          </div>

          <p className="delteButton" onClick={() => handleSubmit(item.id)}>
            X
          </p>
        </div>
      );
    });
  };

  return (
    <main>
      <h1 className="font-black text-5xl p-5">Ogloszenia</h1>
      <div className="ogloszenia flex flex-row flex-wrap justify-center">
        {" "}
        <Ogloszenia1 />
      </div>
    </main>
  );
}
