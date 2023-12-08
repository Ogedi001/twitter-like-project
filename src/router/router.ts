import { Router } from "express";
import createuserWithPost from "../controller/prisma";

const router = Router()

router.get('/post', createuserWithPost)

export default router