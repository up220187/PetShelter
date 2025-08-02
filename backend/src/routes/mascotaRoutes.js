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
            .isInt({ min: 0 })
            .withMessage("La edad debe ser un número entero positivo"),
        body("masSexo")
            .notEmpty()
            .withMessage("El sexo de la mascota es obligatorio"),
        body("masTamaño")
            .notEmpty()
            .isEnumeration({ values: ["Pequeño", "Mediano", "Grande"] })
            .withMessage("El tamaño de la mascota es obligatorio"),
        body("estadoId")
            .isInt()
            .withMessage("El ID del estado debe ser un número entero"),
    ],
    validate,
    mascotaController.crearMascota
);

router.get(
    "/"[
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
        body("nombre")
            .notEmpty()
            .withMessage("El nombre es obligatorio"),
        body("edad")
            .isInt({ min: 0 })
            .withMessage("La edad debe ser un número entero positivo"),
        body("tipo")
            .notEmpty()
            .withMessage("El tipo de mascota es obligatorio"),
        body("raza")
            .notEmpty()
            .withMessage("La raza es obligatoria"),
        body("estadoId")
            .isInt()
            .withMessage("El ID del estado debe ser un número entero"),
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
