# peliculas-app

Modificaciones:

- Implementacion del campo Sinopsis

- Implementacion de funcionalidad subscribePeliculas que permite que al actualizar la base de datos, este cambio se vea reflejado automaticamente
  en la vista de todos los usuarios sin necesidad de que tengan que hacer refresh

- Implementacion de la libreria vuelidate para validar los datos que se ingresan en los formulario de ingresos (peliculas, generos, actores y registro de usuario), ademas de impedir que se registren varios usuarios con un mismo correo electronico

- Creacion de la funcion getCurrentUser en authService para impedir que al refrescar dentro de la seccion generos o actores devuelva al usuario al login

- Crear un sistema de filtrado que permita a los usuarios buscar peliculas por nombre, genero o actor

- Implementar "Toast" para mostrar notificaciones

- Nueva funcion para que los usuarios puedan marcar peliculas en sus favoritos, estos favoritos se guardaran en su
  usuario
