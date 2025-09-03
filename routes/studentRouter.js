import express from 'express';
import { getAllStudents, saveStudent } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.get('/',getAllStudents)

studentRouter.post('/',saveStudent)


export default studentRouter;




