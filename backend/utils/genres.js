import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const genresFilePath = join(__dirname, "..", "Json", "genres.json");

let genresCache = null;

async function loadGenres() {
    if (!genresCache) {
        const data = await readFile(genresFilePath, "utf-8");
        genresCache = JSON.parse(data);
        if (!Array.isArray(genresCache)) {
            throw new Error("Formato inválido en genres.json: debe ser un arreglo");
        }
    }
    return genresCache;
}

export async function mapGenreIdsToNames(genreIds) {
    if (!Array.isArray(genreIds)) return [];
    const genres = await loadGenres();
    return genreIds
        .map(id => {
            const genre = genres.find(g => g.id === id);
            return genre ? genre.name : null;
        })
        .filter(Boolean);
}

export async function getAllGenres() {
    const genres = await loadGenres();
    return genres
        .map(g => g.name)
        .sort((a, b) => a.localeCompare(b));
}
