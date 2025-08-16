import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaHeart, FaSun, FaMoon, FaPlus } from "react-icons/fa";

const characterImages = {
  1: "https://storage.googleapis.com/littlenimobucket/wp-content/uploads/2024/07/spidey-wallpaper-4k-47.jpeg",
  2: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsfhEHGwNvurhLHe_-zFW_jIKccWgJ1rG9yA&s",
  3: "https://images8.alphacoders.com/112/thumb-1920-1120619.jpg",
  4: "https://wallpaperbat.com/img/886038-pinterest.jpg",
  5: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUmk8Um2I44BvPIazre0HFXNfGQ7uPD9FHiA&s",
  6: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBzA0Gwlo8hYhX6nxom49fhMAor1uiFtauIw&s",
  7: "https://images.alphacoders.com/106/thumb-1920-1065270.jpg",
  8: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMce7d8vNv8l0gmgwJks_-8hGhtLvGWOXtYQ&s",
};

export default function App() {
  const API_URL = "http://localhost:3000/characters";

  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", realName: "", universe: "Earth-616", rating: 5 });
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const chars = res.data.map(c => ({ ...c, id: Number(c.id) }));
      setCharacters(chars);
    } catch (err) {
      alert("Erreur lors du chargement : " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchCharacters(); }, []);

  const handleEdit = (char) => {
    setForm({ name: char.name, realName: char.realName, universe: char.universe, rating: char.rating || 5 });
    setEditingId(char.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce personnage ?")) return;
    try {
      await axios.delete(`${API_URL}/${Number(id)}`);
      setCharacters(prev => prev.filter(char => char.id !== Number(id)));
      setFavorites(prev => prev.filter(f => f.id !== Number(id)));
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await axios.put(`${API_URL}/${editingId}`, form);
      else await axios.post(API_URL, form);
      setForm({ name: "", realName: "", universe: "Earth-616", rating: 5 });
      setEditingId(null);
      setShowForm(false);
      fetchCharacters();
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + err.message);
    }
  };

  const toggleFavorite = (char) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === char.id)) return prev;
      return [...prev, char];
    });
  };

  const filteredCharacters = characters.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const backgroundStyle = darkMode
    ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white"
    : "bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200 text-gray-900";

  return (
    <div className={`${backgroundStyle} min-h-screen transition-all duration-500 font-sans p-6`}>
      
      {/* TITRE PRINCIPAL EN HAUT */}
      <h1 className="text-5xl font-extrabold text-center mb-6">
        Marvel Characters
      </h1>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-6">
        {/* Ajouter personnage */}
        <button
          onClick={() => setShowForm(true)}
          className="w-12 h-12 flex justify-center items-center bg-red-500 hover:bg-red-400 text-white rounded-full shadow-lg transition transform hover:scale-110"
          title="Ajouter un héros"
        >
          <FaPlus />
        </button>

        {/* Barre de recherche */}
        <div className="flex-1 flex justify-center px-6">
          <input
            type="text"
            placeholder="Rechercher un personnage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-80 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${
              darkMode ? "bg-gray-800 text-white border-gray-700 focus:ring-white" : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Boutons thème et favoris */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowFavorites(true)}
            className={`w-12 h-12 rounded-full flex justify-center items-center shadow-lg transition transform hover:scale-110 ${darkMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"}`}
            title="Favoris"
          >
            <FaHeart />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-12 rounded-full flex justify-center items-center shadow-lg transition transform hover:scale-110 ${darkMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"}`}
            title="Changer de thème"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Modale Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-8 rounded-3xl shadow-2xl w-96 animate-slideUp`}>
            <h2 className="text-2xl font-bold mb-4">{editingId ? "Modifier" : "Ajouter"} un héros</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nom du personnage"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-white" : "bg-white text-gray-900 border-gray-300 focus:ring-red-500"}`}
              />
              <input
                type="text"
                placeholder="Vrai nom"
                value={form.realName}
                onChange={(e) => setForm({ ...form, realName: e.target.value })}
                required
                className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-white" : "bg-white text-gray-900 border-gray-300 focus:ring-red-500"}`}
              />
              <input
                type="text"
                placeholder="Univers"
                value={form.universe}
                onChange={(e) => setForm({ ...form, universe: e.target.value })}
                className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-white" : "bg-white text-gray-900 border-gray-300 focus:ring-red-500"}`}
              />
              <input
                type="number"
                placeholder="Rating (1-5)"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                min="1"
                max="5"
                className={`px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 ${darkMode ? "bg-gray-700 text-white border-gray-600 focus:ring-white" : "bg-white text-gray-900 border-gray-300 focus:ring-red-500"}`}
              />
              <div className="flex justify-end gap-4 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition">Annuler</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white transition">{editingId ? "Mettre à jour" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Favoris */}
      {showFavorites && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} p-8 rounded-3xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto relative`}>
            <h2 className="text-2xl font-bold mb-4">Personnages favoris</h2>
            <button onClick={() => setShowFavorites(false)} className="absolute top-4 right-4 text-xl">✕</button>
            {favorites.length === 0 ? (
              <p>Aucun favori pour le moment.</p>
            ) : (
              <ul className="space-y-4">
                {favorites.map(char => (
                  <li key={char.id} className="flex items-center gap-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <img src={characterImages[char.id]} alt={char.name} className="w-16 h-20 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-bold">{char.name}</h3>
                      <p className="text-sm">{char.universe}</p>
                    </div>
                    <button
                      onClick={() => setFavorites(prev => prev.filter(f => f.id !== char.id))}
                      className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded transition"
                    >
                      Supprimer
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Characters Grid */}
      {loading ? (
        <p className="text-center text-xl font-bold animate-pulse mt-20">Chargement...</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4">
          {filteredCharacters.map((char) => (
            <li key={char.id} className={`relative rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all ${darkMode ? "bg-gray-800" : "bg-white"}`}>
              {/* Bouton Ajouter aux favoris */}
              <div className="absolute top-2 right-2 z-10">
                <button
                  onClick={() => toggleFavorite(char)}
                  className="p-2 bg-yellow-400 hover:bg-yellow-300 rounded-full transition"
                >
                  <FaHeart className="text-white" />
                </button>
              </div>

              <img
                src={characterImages[char.id] || "https://via.placeholder.com/300x400?text=No+Image"}
                alt={char.name}
                className="w-full h-64 object-cover"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{char.name}</h2>
                <p className="text-sm mb-2">{char.universe}</p>
                <div className="flex mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} className={i < (char.rating || 5) ? "text-yellow-400" : "text-gray-400"} />
                  ))}
                </div>
                <div className="flex justify-center gap-2">
                  <button onClick={() => handleEdit(char)} className="px-3 py-1 bg-red-500 hover:bg-red-400 rounded transition text-white">Modifier</button>
                  <button onClick={() => handleDelete(char.id)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded transition text-white">Supprimer</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
