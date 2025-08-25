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

function toDate(ISO8601) {
  if (!ISO8601) return '';
  const date = new Date(ISO8601);
  return date.toLocaleDateString('fr-FR');
}

function toISO8601(ddmmyyyy) {
  if (!ddmmyyyy) return null;
  const [day, month, year] = ddmmyyyy.split('/');
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
}

async function readingList() {
  let filter = "A lire"
  const result = await db.query("SELECT * FROM books WHERE NOT status = $1 ORDER BY date_begin DESC", [filter]);
  
  let readList = result.rows.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    editor: book.editor,
    status: book.status,
    dateBegin: toDate(book.date_begin),
    dateEnd: toDate(book.date_end),
    type: book.type
  }));
  let numberBooks = readList.length;
  return {readList, numberBooks};
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
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post("/add", async (req,res) => {
  let newBegin = toISO8601(req.body["dateBegin"]);
  let newEnd = toISO8601(req.body["dateEnd"]);
  const {
    title: newTitle = '',
    author: newAuthor = '',
    editor: newEditor = '',
    status: newStatus = '',
    type: newType = ''
  } = req.body;
  try {
    const newRecord = await db.query(`INSERT INTO books (title, author, editor, status, type, date_begin, date_end) 
      VALUES($1, $2, $3, $4, $5, $6, $7)`, 
      [newTitle, newAuthor, newEditor, newStatus, newType, newBegin, newEnd]
    );
    res.redirect("/meslectures");
  } catch (error) {
    console.log(error);
  };
});

app.post("/edit", async (req, res) => {
  const updatedBegin = toISO8601(req.body.dateBegin);
  const updatedEnd = toISO8601(req.body.dateEnd);  
  const {
    title: updatedTitle = '', 
    author: updatedAuthor = '',
    editor: updatedEditor = '',
    status: updatedStatus = '',
    id: updatedId
  } = req.body;

  try {
    const updatedRecord = await db.query(`
      UPDATE books
      SET title = $1, author = $2, editor = $3, status = $4, date_begin = $5, date_end = $6
      WHERE id = $7
      `, 
      [updatedTitle, updatedAuthor, updatedEditor, updatedStatus, updatedBegin, updatedEnd, updatedId]);
    res.redirect("/meslectures");
  } catch (error) {
      console.log(error);
  }
})

