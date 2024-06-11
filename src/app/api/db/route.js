import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export async function GET(request) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: "lapkapapakamysql-lapkapapaka1.f.aivencloud.com",
      port: 22285,
      user: "avnadmin",
      password: "AVNS_5wiFNkFY8WVungXzcmn",
      database: "defaultdb",
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 10000, // 10 seconds
    });

    const [rows] = await connection.execute("SELECT * FROM ogloszenia");

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(request) {
  let connection = null;
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const image = formData.get("image");

    connection = await mysql.createConnection({
      host: "lapkapapakamysql-lapkapapaka1.f.aivencloud.com",
      port: 22285,
      user: "avnadmin",
      password: "AVNS_5wiFNkFY8WVungXzcmn",
      database: "defaultdb",
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 10000, // 10 seconds
    });

    const [result] = await connection.execute(
      "INSERT INTO ogloszenia (title, description) VALUES (?, ?)",
      [title, description]
    );
    const insertedId = result.insertId;

    if (image) {
      const newImageName = `${insertedId}${path.extname(image.name)}`;
      const newImagePath = `/images/${newImageName}`;

      await connection.execute(
        "UPDATE ogloszenia SET image_url = ? WHERE id = ?",
        [newImagePath, insertedId]
      );

      const imagePath = path.join(
        process.cwd(),
        "public",
        "images",
        newImageName
      );
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.promises.writeFile(imagePath, buffer);
    }

    return new Response(
      JSON.stringify({ message: "Ogłoszenie zostało dodane." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during POST request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
