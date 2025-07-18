import express from 'express';
import { createTable, deleteTable, getAllTables } from '../controllers/table.controller.js';

const router = express.Router();

router.post("/", createTable);
router.get("/", getAllTables);
router.delete("/:id", deleteTable);

export default router;