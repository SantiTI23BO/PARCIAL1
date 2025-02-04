import User from "../models/usuarioModelo.js";
import { encriptarPassword, validarPassword } from "../middlewares/funcionesPassword.js";
import { crearToken } from "../libs/jwt.js";

export const register = async ({ username, email, password }) => {
    try {
        const [usuarioDuplicado, emailDuplicado] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email })
        ]);

        if (usuarioDuplicado || emailDuplicado) {
            return { error: "Usuario ya existente" };
        }

        const { salt, hash } = encriptarPassword(password);
        const dataUser = new User({ username, email, password: hash, salt });
        const respuestaMongo = await dataUser.save();
        
        const token = await crearToken({ id: respuestaMongo._id });

        return { mensaje: "Usuario Registrado", token };
    } catch (error) {
        console.error(error);
        return { error: "Error de Registro" };
    }
};

export const login = async ({ username, password }) => {
    try {
        const usuarioEncontrado = await User.findOne({ username });
        if (!usuarioEncontrado) return { error: "Datos incorrectos" };

        const passwordValido = validarPassword(password, usuarioEncontrado.salt, usuarioEncontrado.password);
        if (!passwordValido) return { error: "Datos incorrectos" };

        const token = await crearToken({ id: usuarioEncontrado._id });

        return { mensaje: `Bienvenido, ${usuarioEncontrado.username}`, token };
    } catch (error) {
        console.error(error);
        return { error: "Error al iniciar sesión" };
    }
};

export const obtenerUsuarios = async () => {
    try {
        const usuarios = await User.find();
        return { mensaje: "Usuarios encontrados", usuarios };
    } catch (error) {
        console.error(error);
        return { error: "Error al obtener usuarios" };
    }
};

export const obtenerUsuarioPorId = async (id) => {
    try {
        const usuario = await User.findById(id);
        if (!usuario) return { error: "Usuario no encontrado" };

        return { mensaje: "Usuario encontrado", usuario };
    } catch (error) {
        console.error(error);
        return { error: "Error al buscar usuario" };
    }
};

export const borrarUsuarioPorId = async (id) => {
    try {
        const usuarioEliminado = await User.findByIdAndDelete(id);
        if (!usuarioEliminado) return { error: "Usuario no encontrado" };

        return { mensaje: "Usuario borrado exitosamente" };
    } catch (error) {
        console.error(error);
        return { error: "Error al borrar usuario" };
    }
};

export const actualizarUsuarioPorId = async (id, datosActualizados) => {
    try {
        const usuario = await User.findById(id);
        if (!usuario) return { error: "Usuario no encontrado" };

        Object.assign(usuario, datosActualizados);
        await usuario.save();

        return { mensaje: "Información actualizada exitosamente" };
    } catch (error) {
        console.error(error);
        return { error: "Error al actualizar usuario" };
    }
};
