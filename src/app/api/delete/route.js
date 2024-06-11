import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export async function POST(request) {
  let connection = null;
  try {
    const formData = await request.formData();

    const id = formData.get("id");

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
      "DELETE FROM ogloszenia WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return new Response(
        JSON.stringify({ message: "Ogłoszenie nie istnieje." }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const imageExtensions = [".jpg", ".png", ".gif"]; // Add more extensions if needed
    for (const ext of imageExtensions) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        "images",
        `${id}${ext}`
      );
      if (fs.existsSync(imagePath)) {
        await fs.promises.unlink(imagePath);
      }
    }

    return new Response(
      JSON.stringify({ message: "Ogłoszenie zostało usunięte." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
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
