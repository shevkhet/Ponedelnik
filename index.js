import express from 'express';
import pg from 'pg';
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost", 
  database: "library",
  password :"Fluctuat_Nec",
  port: 5432
});
db.connect()

function formatDate(dateSource) {
  const date = new Date(dateSource);
  // Extraire le jour, le mois et l'année
  const jour = String(date.getUTCDate()).padStart(2, '0');
  const mois = String(date.getUTCMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
  const annee = date.getUTCFullYear();

  // Retourner la date au format JJ/MM/AAAA
  return `${jour}/${mois}/${annee}`;
};

async function readingList() {
  let filter = "A lire"
  const result = await db.query("SELECT * FROM books WHERE NOT status = $1 ORDER BY date_begin DESC", [filter]);
  let readList = result.rows.map(book => ({
    title: book.title,
    author: book.author,
    editor: book.editor,
    status: book.status,
    dateBegin: formatDate(book.date_begin),
    dateEnd: formatDate(book.date_end),
    type: book.type
  }))
  let numberBooks = readList.length
  return {readList, numberBooks}
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/meslectures", async (req, res) => {
  const { readList, numberBooks } = await readingList();
  res.render("myreadings.ejs", {
    resultList: readList,
    numberBooks: numberBooks 
  });
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post("/add", (req,res) => {
  console.log(req.body)
})
