const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
import { useToast } from "vue-toastification";
import { convertirErrores } from "@/utils/errorMessages";

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
    toast.error("Error buscando la pelicula: " + convertirErrores(error.code));
  }
};

export const obtenerDetallesTMDB = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`,
    );
    return await response.json();
  } catch (error) {
    toast.error(
      "Error obteniendo detalles de TMDB: " + convertirErrores(error.code),
    );
    return null;
  }
};

export const obtenerTrailerTMDB = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-MX`,
    );
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      const responseEn = await fetch(
        `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
      );
      const dataEn = await responseEn.json();
      return dataEn.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      )?.key;
    }

    return data.results.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    )?.key;
  } catch (error) {
    toast.error("Error obteniendo el trailer: " + convertirErrores(error.code));
    return null;
  }
};
