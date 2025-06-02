// src/controllers/UserController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

/**
 * POST /login
 * Body: { email, password }
 * Devuelve { token } si las credenciales son correctas.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Buscamos al usuario por email
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    // 2) Comparamos la contraseña con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect email or password." });
    }

    // 3) Creamos el payload para el JWT (sin incluir password)
    const payload = {
      id_user: user.id_user,
      name:    user.name,
      email:   user.email,
      role:    user.role
    };

    // 4) Firmamos el token con la clave de entorno JWT_SECRET
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /users
 * Devuelve lista de todos los usuarios.
 * (Debes proteger esta ruta con middleware que compruebe que solo "admin" accede).
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ['password'] } // nunca devolvemos el hash
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /users/:id
 * Devuelve un usuario individual (sin password).
 */
export const getUser = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      where: { id_user: req.params.id },
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /users
 * Body: { name, email, password }
 * Crea un usuario con role='user' y contraseña hasheada.
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1) Validaciones básicas
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    // 2) Verificar que el email no esté ya en uso
    const existing = await UserModel.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    // 3) Hachear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4) Crear el usuario con role='user'
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    // 5) Opcional: devolver datos del usuario (sin password)
    const { password: _, ...userData } = newUser.get({ plain: true });
    return res.status(201).json(userData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /users/:id
 * Body: { name?, email?, password? }
 * Actualiza un usuario. Si envían password, lo hashea antes.
 */
export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { id } = req.params;

    // 1) Comprobar que el usuario existe
    const user = await UserModel.findOne({ where: { id_user: id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 2) Preparar objeto de actualización
    const updatedData = {};
    if (name)  updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // 3) Ejecutar la actualización
    await UserModel.update(updatedData, { where: { id_user: id } });
    return res.json({ message: 'User updated successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /users/:id
 * Elimina un usuario por su ID.
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1) Comprobar que el usuario existe
    const user = await UserModel.findOne({ where: { id_user: id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 2) Eliminar
    await UserModel.destroy({ where: { id_user: id } });
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
