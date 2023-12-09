import { Response, Request } from "express";
import { Like, Prisma, PrismaClient } from "@prisma/client";
import { error } from "console";
const prisma = new PrismaClient();

const jonny = {
  userid: "0852a1df-0892-4acf-9218-a62e170da1c9",
  post1ID: "5838a81c-a01b-4efe-ad00-2c622b63e375",
};
const micheal = {
  userid: "594be724-7c4a-4848-88f5-fa747830e591",
  post1ID: "c1f8a446-aa2a-4f55-830d-98ecbd2cb7d4",
};

//create new comment function
const createCommentFunc = async (
  userId: string,
  postId: string,
  comment: string
) => {
  const newComment = await prisma.comment.create({
    data: {
      content: comment,
      postID: postId,
      userID: userId,
    },
  });
  return newComment;
};

// //the function takes 3 parameter, postID must be provided, other 2 optional
// // allows a user to like existing post or comment OR create new like record for a post or comment
// const likedPostOrCommentFunc = async (
//   postID: string,
//   commentID?: string,
//   likedPostorCommentID?: string
// ) => {
//   //check if likeedPostorCommentID is provided
//   if (likedPostorCommentID) {
//     //find an existing like record
//     const likedPostOrComment = await prisma.like.findUnique({
//       where: {
//         id: likedPostorCommentID,
//       },
//     });

//     //check if the record is null or undefined
//     if (!likedPostOrComment) {
//       await prisma.like.create({
//         data: {
//           likes: 1,

//           //using connect to like existing comment
//           likedPosts: {
//             connect: {
//               id: postID,
//             },
//           },

//           //using connect to link to existing comment
//           likedComments: {
//             connect: {
//               id: commentID,
//             },
//           },

//         },

//       });
//       return;
//     }
//     //increment likes field in the existin record
//     likedPostOrComment.likes++;

//     //return updated like record
//     return likedPostOrComment;
//   } else {
//     //create new like record
//     const likedPostOrComment = await prisma.like.create({
//       data: {
//         likes: 1,

//         //using connect to like existing comment
//         likedPosts: {
//           connect: {
//             id: postID,
//           },
//         },

//         //using connect to link to existing comment
//         //like comment can be a string or undefined
//         likedComments:commentID? {
//           connect: {
//             id: commentID,
//           },
//         }:undefined,
//       },
//     });

//     //return new created like record
//     return likedPostOrComment
//   }
// };



//the function takes 4 parameter, userID and postID must be provided, other 2 optional
// allows a user to like existing post or comment OR create new like record for a post or comment

//...modifications...//
//only existing user can like post or comment
//a user can like a existing post or comment once

const likedPostOrCommentFunc = async (
  userID: string,
  postID: string,
  commentID?: string,
  likedPostorCommentID?: string
) => {
  // Check if likedPostorCommentID is provided
  if (likedPostorCommentID) {
    // Find an existing like record using the provided ID
    const likedPostOrComment = await prisma.like.findUnique({
      where: {
        id: likedPostorCommentID,
      },
    });

    // Check if the record is null or undefined
    if (!likedPostOrComment) {
      // If the record doesn't exist, create a new like record
      await prisma.like.create({
        data: {
          likes: 1,

          // Use connect to associate the like with an existing user
          user: {
            connect: {
              id: userID,
            },
          },

          // Use connect to associate the like with an existing post
          likedPosts: {
            connect: {
              id: postID,
            },
          },

          // Use connect to link to an existing comment (if provided)
          likedComments: commentID
            ? {
                connect: {
                  id: commentID,
                },
              }
            : undefined,
        },
      });

      return; // Exit the function after creating the new like record
    }

    //create a condition varieble
    //// Condition to check if the post exists in like and a new user is attempting to like
    const condition: boolean =
      likedPostOrComment.postID === postID &&
      likedPostOrComment.userID !== userID;

    // when condition is true
    if (condition) {
      // If so, increment the likes field in the existing record
      likedPostOrComment.likes++;

      // Return the updated like record
      return likedPostOrComment;
    }
    //when condition is false
    else if (!condition) {
      // Log an error message and throw an error if the user liked the post already
      console.log("User liked the post already");
      throw new Error("User liked the post already");
    }

    // Throw an error if the like record doesn't exist
    throw new Error("Like record does not exist");
  } else {
    // If likedPostorCommentID is not provided, create a new like record
    const likedPostOrComment = await prisma.like.create({
      data: {
        likes: 1,

        // Use connect to associate the like with an existing user
        user: {
          connect: {
            id: userID,
          },
        },

        // Use connect to associate the like with an existing post
        likedPosts: {
          connect: {
            id: postID,
          },
        },

        // Use connect to link to an existing comment (if provided)
        likedComments: commentID
          ? {
              connect: {
                id: commentID,
              },
            }
          : undefined,
      },
    });

    // Return the newly created like record
    return likedPostOrComment;
  }
};



const createuserWithPost = async (req: Request, res: Response) => {
  try {
    const result = await likedPostOrCommentFunc(
      micheal.userid,
      micheal.post1ID
    );
    console.log("michael like his post");
    const result2 = await likedPostOrCommentFunc(jonny.userid, jonny.post1ID);
    console.log("jonny likes his  post");
    // });
    // const resultP = await prisma.post.findMany()
    const resultU = await prisma.like.findMany();
    // console.log(resultP);
    console.log(resultU);
  } catch (error) {
    console.log("error: ", error);
  } finally {
    await prisma.$disconnect();
  }
};
export default createuserWithPost;
