import express from "express"
import userRouter from "./user.js"
import budgetRouter from "./budget.js"
import expenseRouter from "./expense.js"

const router = express.Router()

router.use("/user",userRouter)
router.use("/budget",budgetRouter)
router.use("/expense",expenseRouter)

export default router