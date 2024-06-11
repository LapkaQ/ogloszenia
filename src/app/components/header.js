import React from "react";
import Link from "next/link";
import "./headerStyle.css";
export default function Header() {
  return (
    <header>
      {" "}
      <h1 className="font-black text-5xl p-5">Header</h1>
      <ul>
        <li>
          <Link href="/ogloszenia">Ogłoszenia</Link>
        </li>
        <li>
          <Link href="/ogloszeniaadd">Dodaj ogłoszenie</Link>
        </li>
        <li>
          <Link href="/ogloszeniadelete">Usuń ogłoszenie</Link>
        </li>
      </ul>
    </header>
  );
}
