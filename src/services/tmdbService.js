const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
import { useToast } from "vue-toastification";

const toast = useToast();

export const buscarPeliculasTMDB = async (query) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`,
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    toast.error("Error buscando la pelicula: ", error);
  }
};

export const obtenerDetallesTMDB = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`,
    );
    return await response.json();
  } catch (error) {
    toast.error("Error obteniendo detalles de TMDB: ", error);
    return null;
  }
};
