import { Router } from "express";
import { 
    register, 
    login, 
    obtenerUsuarios, 
    obtenerUsuarioPorId, 
    borrarUsuarioPorId, 
    actualizarUsuarioPorId 
} from "../db/usuariosDB.js";

const router = Router();

router.post("/registro", async (req, res) => {
    try {
        const respuesta = await register(req.body);
        if (respuesta.token) {
            res.cookie("token", respuesta.token, { httpOnly: true }); 
        }
        return res.status(200).json({ mensaje: respuesta.mensaje });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ mensaje: "Error en el registro" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const respuesta = await login(req.body);
        if (respuesta.token) {
            res.cookie("token", respuesta.token, { httpOnly: true }); 
        }
        return res.status(200).json({ mensaje: respuesta.mensaje });
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json({ mensaje: "Error en el inicio de sesión" });
    }
});

router.get("/usuarios", async (req, res) => {
    try {
        const respuesta = await obtenerUsuarios();
        return res.status(200).json({ mensaje: respuesta.mensaje, usuarios: respuesta.usuarios });
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
});

router.get("/usuarios/:id", async (req, res) => {
    try {
        const respuesta = await obtenerUsuarioPorId(req.params.id);
        return res.status(200).json({ mensaje: respuesta.mensaje, usuario: respuesta.usuario });
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json({ mensaje: "Error al buscar usuario" });
    }
});

router.delete("/usuarios/:id", async (req, res) => {
    try {
        const respuesta = await borrarUsuarioPorId(req.params.id);
        return res.status(200).json({ mensaje: respuesta });
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json({ mensaje: "Error al borrar usuario" });
    }
});

router.put("/usuarios/:id", async (req, res) => {
    try {
        const respuesta = await actualizarUsuarioPorId(req.params.id, req.body);
        return res.status(200).json({ mensaje: respuesta }); 
    } catch (error) {
        console.error(error); // Para depuración
        return res.status(500).json({ mensaje: "Error al actualizar usuario" });
    }
});

export default router;