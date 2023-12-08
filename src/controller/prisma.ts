import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const jonny={
  userid:'bbab78f9-8cb4-4c62-a7fd-fb4d0594a438',
  post1_id:'fa7027bf-b7cd-4980-a95c-35073ed62814',
  post2_id: 'bbab78f9-8cb4-4c62-a7fd-fb4d0594a438'
}
const prismaUser ={
  userid:'0f03924d-aaa8-4295-ab62-59f5b9fe501e',
  post1_id:'64b4f747-3976-4704-8de2-125ddcc22b87',
  post2_id: '4fc729f8-6fff-4dc3-9b4d-7fc9dae3d669'
}

const createComment= async (id:string, comment:string, postId:string, userId:string)=>{
const newComment= await prisma.comment.create({
  data:{
    content:comment,
    postID:postId,
    userID:userId
  }
})
return newComment
}
const createuserWithPost = async (req: Request, res: Response) => {
  try {
    
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};
export default createuserWithPost;

