"use client";
import React, { useState } from "react";
import "./ogloszeniaAddStyle.css";

export default function OgloszeniaAdd() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imagePath: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    let imagePath = "";
    if (imageFile !== null) {
      imagePath = `/images/${imageFile.name}`;
    }
    setFormData({
      ...formData,
      image: imageFile,
      imagePath: imagePath,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title !== "" && formData.description !== "") {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        if (formData.image) {
          formDataToSend.append("image_url", formData.imagePath);
          formDataToSend.append("image", formData.image);
        }

        const response = await fetch("/api/db", {
          method: "POST",
          body: formDataToSend,
        });

        setFormData({
          title: "",
          description: "",
          image: null,
          imagePath: "",
        });
        if (response.ok) {
          setMessage("Ogłoszenie zostało dodane.");
        } else {
          setMessage("Wystąpił błąd. Spróbuj ponownie.");
        }
      } catch (error) {
        setMessage("Wystąpił błąd. Spróbuj ponownie.");
      }
    } else {
      setMessage("Wypelnij wszystkie dane!");
    }
  };

  return (
    <main className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl">Dodaj nowe ogłoszenie</h1>
      <form
        onSubmit={handleSubmit}
        className="ogloszenieAdd flex flex-col items-center justify-between"
      >
        <div className="inputOgloszenieAdd">
          <label>Tytuł:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="inputOgloszenieAdd">
          <label>Opis:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="inputOgloszenieAdd">
          <label>Zdjęcie:</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="submitOgloszenieAdd">
          Dodaj ogłoszenie
        </button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
