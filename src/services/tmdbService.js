// API key to connect to the TMDB API
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// The base URL of the TMDB API
const BASE_URL = "https://api.themoviedb.org/3";
// Vue Libraries
import { useToast } from "vue-toastification";
// Utils
import { convertErrors } from "@/utils/errorMessages";

// Composables
const toast = useToast();

// METHODS

/**
 * Method to search movies from the TMDB API by name
 * Returns an array of matching results; if no query is provided, returns an empty array
 * In case of an error, it displays a toast notification
 */

export const searchTMDBMovies = async (query) => {
  if (!query) return [];

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`,
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    toast.error("Error buscando la película: " + convertErrors(error.code));
  }
};

/**
 * Method to retrieve the details of a specific movie by its ID
 * If successful, it returns all the data of the movie; in case of an error, it returns null
 */

export const getTMDBDetails = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`,
    );
    return await response.json();
  } catch (error) {
    toast.error(
      "Error obteniendo detalles de TMDB: " + convertErrors(error.code),
    );
    return null;
  }
};

/**
 * Method to get the trailer of a movie from TMDB by its ID
 * First, it looks for a trailer in Latin American Spanish; if not found, it then searches for the trailer in English
 * If successful, it returns the video ID to be embedded on YouTube; in case of an error, it returns null and displays a toast
 */

export const getTMDBTrailer = async (id) => {
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
    toast.error("Error obteniendo el tráiler: " + convertErrors(error.code));
    return null;
  }
};
