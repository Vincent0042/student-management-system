const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/Student");
const app = express();


app.use(cors());
app.use(express.json());


mongoose
 .connect(process.env.MONGO_URI)
 .then(() => {
   console.log("Connected to MongoDB");
 })
 .catch((error) => {
   console.error("MongoDB Connection Error:", error);
 });

app.get("/students", async (req, res) => {
 try {
   const students = await Student.find();
   res.json(students);
 } catch (error) {
   console.error(error);
   res.status(500).json({
     message: "Error fetching students",
   });
 }
});

app.post("/students", async (req, res) => {
 try {
   console.log("BODY:", req.body);
   const { name, course, age } = req.body;
   const student = new Student({
     name,
     course,
     age,
   });
   await student.save();
   res.status(201).json(student);
 } catch (error) {
   console.error("POST ERROR:", error);
   res.status(500).json({
     message: error.message,
   });
 }
});

app.put("/students/:id", async (req, res) => {
 try {
   const { name, course, age } = req.body;
   const updatedStudent = await Student.findByIdAndUpdate(
req.params.id,
     {
       name,
       course,
       age,
     },
     {
       new: true,
     }
   );
   res.json(updatedStudent);
 } catch (error) {
   console.error(error);
   res.status(500).json({
     message: "Error updating student",
   });
 }
});

app.delete("/students/:id", async (req, res) => {
 try {
   await Student.findByIdAndDelete(req.params.id);
   res.json({
     message: "Student deleted successfully",
   });
 } catch (error) {
   console.error(error);
   res.status(500).json({
     message: "Error deleting student",
   });
 }
});
// Test Route
app.get("/", (req, res) => {
 res.send("Server is working!");
});
// Start Server
app.listen(5000, () => {
 console.log("Server running on port 5000");
});