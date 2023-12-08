import express, { Request, Response, NextFunction } from "express";
import router from "./router/router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);


//Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  const err: Error = new Error('Not Found');
  res.status(404);
  next(err);
});

//error handling midleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});



app.listen(3000, () => console.log("server running on port 3000"));
