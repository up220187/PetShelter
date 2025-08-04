const express = require("express");
const { body, param, query } = require("express-validator");
const validate = require("../middlewares/validation");
const authMiddleware = require("../middlewares/authMiddlewares");
const router = express.Router();
const mascotaController = require("../controllers/mascotaController");

router.post(
    "/",
    [
        authMiddleware,
        body("masNombre")
            .notEmpty()
            .isLength({ max: 50 })
            .withMessage("El nombre es obligatorio"),
        body("masNacimiento")
            .notEmpty()
            .isISO8601().withMessage("La fecha de nacimiento debe estar en formato YYYY-MM-DD"),
        body("masSexo")
            .notEmpty()
            .isIn(["Macho", "Hembra"])
            .withMessage("El sexo de la mascota es obligatorio"),
        body("masTamaño")
            .notEmpty()
            .isIn(["Pequeño", "Mediano", "Grande"])
            .withMessage("El tamaño de la mascota es obligatorio"),
        body("masEstadoSalud")
            .notEmpty().withMessage("El estado de salud es obligatorio"),
        body("masComportamiento")
            .notEmpty()
            .isIn(["Agresivo", "Asustadizo", "Juguetón", "Tranquilo"])
            .withMessage("El comportamiento es obligatorio"),
        body("masEsterilizado")
            .isBoolean().withMessage("El campo de esterilización debe ser booleano"),
        body("masEstado")
            .optional()
            .isIn(["Disponible", "En Proceso", "Adoptado"]),
        body("masTipo")
            .notEmpty()
            .isIn(["Perro", "Gato", "Ave", "Reptil", "Roedor", "Otro"])
            .withMessage("El tipo de mascota es obligatorio y debe ser válido"),
        body("masIdRefugio")
            .notEmpty()
            .isMongoId().withMessage("El ID del refugio debe ser un ObjectId válido"),
    ],
    validate,
    mascotaController.crearMascota
);

router.get(
    "/",
    [
    (authMiddleware,
        query("page")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Page must be a positive integer"),
        query("limit")
            .optional()
            .isInt({ min: 1 })
            .withMessage("Limit must be a positive integer"))
    ],
    validate,
    mascotaController.obtenerMascotas
);

router.get(
    "/:id",
    [
        authMiddleware,
        param("id")
            .isMongoId()
            .withMessage("El ID debe ser un ID de MongoDB válido"),
    ],
    mascotaController.obtenerMascotaPorId
);

router.put(
    "/:id",
    [
        authMiddleware,
        param("id")
            .isMongoId()
            .withMessage("El ID debe ser un ID de MongoDB válido"),
        body("masNombre")
            .notEmpty()
            .isLength({ max: 50 })
            .withMessage("El nombre es obligatorio"),
        body("masNacimiento")
            .notEmpty()
            .isISO8601().withMessage("La fecha de nacimiento debe estar en formato YYYY-MM-DD"),
        body("masSexo")
            .notEmpty()
            .isIn(["Macho", "Hembra"])
            .withMessage("El sexo de la mascota es obligatorio"),
        body("masTamaño")
            .notEmpty()
            .isIn(["Pequeño", "Mediano", "Grande"])
            .withMessage("El tamaño de la mascota es obligatorio"),
        body("masEstadoSalud")
            .notEmpty().withMessage("El estado de salud es obligatorio"),
        body("masComportamiento")
            .notEmpty()
            .isIn(["Agresivo", "Asustadizo", "Juguetón", "Tranquilo"])
            .withMessage("El comportamiento es obligatorio"),
        body("masEsterilizado")
            .isBoolean().withMessage("El campo de esterilización debe ser booleano"),
        body("masEstado")
            .optional()
            .isIn(["Disponible", "En Proceso", "Adoptado"]),
        body("masTipo")
            .notEmpty()
            .isIn(["Perro", "Gato", "Ave", "Reptil", "Roedor", "Otro"])
            .withMessage("El tipo de mascota es obligatorio y debe ser válido"),
        body("masIdRefugio")
            .notEmpty()
            .isMongoId().withMessage("El ID del refugio debe ser un ObjectId válido"),
    ],
    validate,
    mascotaController.actualizarMascotaPorId
);

router.delete(
    "/:id",
    [
        authMiddleware,
        param("id")
            .isMongoId()
            .withMessage("El ID debe ser un ID de MongoDB válido"),
    ],
    mascotaController.borrarMascotaPorId
);

module.exports = router;
