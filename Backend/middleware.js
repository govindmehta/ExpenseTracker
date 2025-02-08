import express from "express" 
import {PrismaClient} from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

// Authentication Middleware
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, "secret_password");
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user){
      res.status(400).json({
        msg: "User not found signup"
      })
    };
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};