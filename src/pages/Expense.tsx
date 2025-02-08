import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Card2 from "../components/Card2";
import { useParams } from "react-router-dom"; // Import useParams
import Loader from "../components/Loader";

function Expense() {
  const { budgetId } = useParams<{ budgetId: string }>(); // Retrieve budgetId from URL
  const [amountUsed, setAmountUsed] = useState<number>(0);
  const [remainingAmount, setRemainingAmount] = useState<number>(0);
  const [expenseList, setExpenseList] = useState<
    { id: string; name: string; amount: number }[]
  >([]);
  const [name, setName] = useState<string>(""); // Name of budget
  const [amount, setAmount] = useState<number>(0); // Total budget amount
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to fetch expenses and budget details from the backend for a given budgetId
  const fetchExpenses = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      // Updated URL: remove the colon before budgetId
      const response = await axios.get(
        `http://localhost:3000/api/v1/expense/expenses/${budgetId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Response data:", response.data);
      // Assume response.data returns an object with budget details and expenses:
      // { budget: { name, totalAmount }, Expenses: [...] }
      setExpenseList(response.data.Expenses);
      setName(response.data.budget.name);
      setAmount(response.data.budget.totalAmount);
      calculateAmounts(response.data.Expenses);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
    setLoading(false);
  };

  // Function to calculate the used and remaining amounts
  const calculateAmounts = (expenses: { name: string; amount: number }[]) => {
    const totalUsed = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    setAmountUsed(totalUsed);
    setRemainingAmount(amount - totalUsed);
  };

  // Function to add an expense
  const addExpense = async () => {
    setLoading(true);
    if (!expenseName || expenseAmount <= 0) return;

    const newExpense = { name: expenseName, amount: expenseAmount };

    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/expense/addExpense/${budgetId}`,
        newExpense,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setExpenseList((prev) => [...prev, response.data.expense]);
      calculateAmounts([...expenseList, response.data.expense]);
      setExpenseName("");
      setExpenseAmount(0);
    } catch (error) {
      console.error("Failed to add expense:", error);
    }
    setLoading(false);
  };

  // Function to delete an expense
  const deleteExpense = async (id: string) => {
    setLoading(true);
    try {
      await axios.post(
        `http://localhost:3000/api/v1/expense/removeExpense/${budgetId}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      const updatedExpenses = expenseList.filter((exp) => exp.id !== id);
      setExpenseList(updatedExpenses);
      calculateAmounts(updatedExpenses);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (budgetId) {
      fetchExpenses();
    }
  }, [budgetId]);

  return (
    <StyledWrapper>
      <div className="container">
        <h1>Expense Info</h1>
        <TopContainer>
          {/* Display the budget name and total amount */}
          <h2>Name of Budget: {name}</h2>
          <h2>Total Budget: {amount.toString()}</h2>
          <h2>Amount Used: {amountUsed.toString()}</h2>
          <h2>Remaining Amount: {remainingAmount.toString()}</h2>
        </TopContainer>
        <h1>Expenses In The Budget</h1>
        <span>
          <input
            type="text"
            placeholder="Name of Expense"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount allotted"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(Number(e.target.value))}
          />
          <button onClick={addExpense}>Add</button>
        </span>
        {loading ? (
          <Loader />
        ) : expenseList.length > 0 ? (
          <BottomContainer>
            {expenseList.map((expense) => (
              <Card2
                key={expense.id}
                name={expense.name}
                amount={expense.amount}
                onDelete={() => deleteExpense(expense.id)}
              />
            ))}
          </BottomContainer>
        ) : (
          <h1>No Expenses Found</h1>
        )}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    width: 100%;
    height: 100%;
    --color: rgba(114, 114, 114, 0.3);
    background-color: #191a1a;
    background-image: linear-gradient(
        0deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      ),
      linear-gradient(
        90deg,
        transparent 24%,
        var(--color) 25%,
        var(--color) 26%,
        transparent 27%,
        transparent 74%,
        var(--color) 75%,
        var(--color) 76%,
        transparent 77%,
        transparent
      );
    background-size: 55px 55px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }
  h1 {
    color: whitesmoke;
    text-shadow: 4px 4px 2px rgba(0, 0, 0, 0.6);
    font-size: 5vh;
  }
  h2 {
    color: black;
    text-shadow: 4px 4px 2px rgba(209, 189, 189, 0.6);
    font-size: 3vh;
  }
  span {
    margin: 0.7rem;
  }
  input {
    border: none;
    font-size: 1rem;
    padding: 0.5rem;
    border-radius: 10px;
    margin: 0 10px;
  }
  button {
    font-size: 1rem;
    padding: 0.5rem;
    border: none;
    border-radius: 10px;
    color: white;
    background-color: #2e3939;
  }
  button:hover {
    cursor: pointer;
  }
`;

const TopContainer = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  background-color: white;
  width: 60%;
  height: 20vh;
  border-radius: 1rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const BottomContainer = styled.div`
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px,
    rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  background-color: white;
  width: 80%;
  height: fit-content;
  border-radius: 1rem;
  margin: 1rem;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: start;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    list-style-type: none;
  }
`;

export default Expense;
