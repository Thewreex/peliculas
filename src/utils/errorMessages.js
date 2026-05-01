// Function to convert Firebase error messages into more user-friendly text
export function convertErrors(error) {
  const messages = {
    "auth/email-already-in-use": "El email ya se encuentra en uso.",
    "auth/invalid-email": "El formato del email es inválido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "El email o la contraseña no son válidos.",
    "auth/user-not-found": "El usuario no existe.",
    "auth/missing-password": "Ingrese la contraseña.",
    "auth/too-many-requests": "Demasiados intentos. Intentá más tarde.",
    "auth/network-request-failed": "Sin conexión a internet.",
    "permission-denied": "Permisos denegados.",
    unavailable: "El servicio no está disponible.",
    "not-found": "Elemento no encontrado.",
    "resource-exhausted": "Se agotó la cuota de Firebase.",
  };

  return messages[error] ?? error;
}
