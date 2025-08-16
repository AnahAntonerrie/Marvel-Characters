import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let characters = [
  { id: 1, name: "Spider-Man", realName: "Peter Parker", universe: "Earth-616" },
  { id: 2, name: "Iron Man", realName: "Tony Stark", universe: "Earth-616" },
  { id: 3, name: "Captain America", realName: "Steve Rogers", universe: "Earth-616" },
  { id: 4, name: "Black Widow", realName: "Natasha Romanoff", universe: "Earth-616" },
  { id: 5, name: "Black Panther", realName: "T'Challa", universe: "Earth-616" },
  { id: 6, name: "Doctor Strange", realName: "Stephen Strange", universe: "Earth-616" },
  { id: 7, name: "Scarlet Witch", realName: "Wanda Maximoff", universe: "Earth-616" },
  { id: 8, name: "Hulk", realName: "Bruce Banner", universe: "Earth-616" }
];

// Routes CRUD

// GET all
app.get('/characters', (req, res) => {
  res.json(characters);
});

// GET by ID
app.get('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const char = characters.find(c => c.id === id);
  if (!char) return res.status(404).json({ error: "Personnage non trouvé" });
  res.json(char);
});

// POST new
app.post('/characters', (req, res) => {
  const { name, realName, universe } = req.body;
  if (!name || !realName) return res.status(400).json({ error: "name et realName requis" });
  const newChar = {
    id: characters.length ? Math.max(...characters.map(c => c.id)) + 1 : 1,
    name,
    realName,
    universe: universe || "Earth-616",
  };
  characters.push(newChar);
  res.status(201).json(newChar);
});

// PUT update by ID
app.put('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = characters.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Personnage non trouvé" });
  characters[idx] = { ...characters[idx], ...req.body };
  res.json(characters[idx]);
});

// DELETE by ID
app.delete('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = characters.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: "Personnage non trouvé" });
  characters.splice(idx, 1);
  res.json({ message: "Personnage supprimé" });
});

app.listen(PORT, () => {
  console.log(`Serveur backend Marvel lancé sur http://localhost:${PORT}`);
});
