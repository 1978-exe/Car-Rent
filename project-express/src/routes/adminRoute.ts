import exp from "constants";
import express from "express";
import {createAdmin,updateAdmin,deleteAdmin,loginAdmin, showAdmin } from "../controller/adminController";
import { verifyAdmin } from "../middleware/verifyAdmin";
const app = express()

app.use(express.json());

app.get('/admin',verifyAdmin, showAdmin);
app.post('/admin',verifyAdmin, createAdmin);
app.put(`/admin/:id`,verifyAdmin,updateAdmin);
app.delete(`/admin/:id`,verifyAdmin,deleteAdmin);
app.post(`/admin/:login`, loginAdmin);

export default app;