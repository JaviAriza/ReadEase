import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

// Login: Verifies credentials and generates a JWT
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email in the 'users' table
        const user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password." });
        }

        // Compare the provided password with the stored password (using bcrypt)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect email or password." });
        }

        // Create a payload with the user's data (without the password)
        const payload = {
            id_user: user.id_user,
            name: user.name,
            email: user.email,
            role: user.role, // Assuming 'role' field exists in UserModel
        };

        // Generate a JWT (expires in 1 hour)
        const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

        // Send the JWT token to the client
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Mostrar todos los Usuarios GET
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll()
        res.json(users)
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Mostrar un Usuario GET
export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({ where: { id_user: req.params.id } })
        res.json(user)
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Crear un Usuario CREATE
export const createUser = async (req, res) => {
    try {
        await UserModel.create(req.body)
        res.json({ message: "has been created successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Actualizar un Usuario PUT
export const updateUser = async (req, res) => {
    try {
        await UserModel.update(req.body, { where: { id_user: req.params.id } })
        res.json({ message: "has been update successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}

// Eliminar un Usuario DELETE
export const deleteUser = async (req, res) => {
    try {
        await UserModel.destroy({ where: { id_user: req.params.id } })
        res.json({ message: "has been delete successfully!" })
    } catch (error) {
        res.json({ message: error.message })
    }
}
