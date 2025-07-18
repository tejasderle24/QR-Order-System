import express from "express";
import Table from "../models/Table.Model.js";

const router = express.Router();

// Create table
export const createTable = async (req, res) => {
    try {
        const { tableId, name, capacity } = req.body;
        const exists = await Table.findOne({ tableId });
        if (exists) return res.status(400).json({ message: "Table already exists" });

        const table = await Table.create({ tableId, name, capacity });
        res.status(201).json(table);
    } catch (err) {
        res.status(500).json({ message: "Error creating table", error: err.message });
    }
}

// Get all tables
export const getAllTables = async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ message: "Error fetching tables", error: err.message });
    }
}

// Delete table
export const deleteTable = async (req, res) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        res.json({ message: "Table deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting table", error: err.message });
    }
}

export default router;
