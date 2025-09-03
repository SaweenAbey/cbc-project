import Student from "../models/student.js";

export function getAllStudents(req,res){
    const student = new Student(req.body);
    Student.find().then(
        (students) => {
            res.json(students);
        }
).catch(
    (error) => {
        res.status(500).json({
            message: "Error retrieving students",
            error: error.message
        });
    });
}

export function saveStudent(req, res) {
const student = new Student(req.body);
student.save()
    .then(() => {
        res.status(201).json({
            message: "Student saved successfully",
            student: student
        });
    })
    .catch((error) => {
        res.status(500).json({
            message: "Error saving student",
            error: error.message
        });
    });
}
export function updateStudent(req,res){
    res.json({
        message: "Student updated successfully"
    });
}
