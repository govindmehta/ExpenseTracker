import styled from "styled-components";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

interface UserObject {
  name: string;
  email: string;
}
type Budget = {
  id: string; // <-- Add this
  name: string;
  totalAmount: string;
};

const HomePage = ({ email, name }: UserObject) => {
  const [bname, setBname] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [n, setN] = useState<Number>(0);
  const [loading, setLoading] = useState<boolean>(false); // 👈 Loading state

  const addBudget = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      const newBudget = {
        name: bname,
        totalAmount: Number(amount), // Convert string to float before sending
      };
      
      console.log(newBudget)
      const response = await axios.post(
        "http://localhost:3000/api/v1/budget/addBudget",
        newBudget,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Budget added:", response.data);

      // **Update UI after successful API call**
      setBudgetList((prev) => [...prev, response.data.budgetAdded]);

      // Clear input fields
      setBname("");
      setAmount("");
    } catch (error: any) {
      console.error(
        "Failed to add budget:",
        error.response?.data || error.message
      );
    }
    setLoading(false);
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBname(e.target.value);
    console.log(e.target.value);
  };
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    console.log(amount);
  };

  useEffect(() => {
    setN(budgetList.length);
  }, [budgetList]);

  const removeBudget = async (budgetId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.delete(
        `http://localhost:3000/api/v1/budget/deleteBudget/${budgetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { budgetId },
        }
      );

      console.log(`Budget ${budgetId} deleted`);

      // **Update UI after successful API call**
      setBudgetList((prev) => prev.filter((budget) => budget.id !== budgetId));
    } catch (error: any) {
      console.error(
        "Failed to delete budget:",
        error.response?.data || error.message
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          console.error("No token found");
          return;
        }

        const result = await axios.get(
          "http://localhost:3000/api/v1/budget/budgets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBudgetList(result.data.budgets);
      } catch (error) {
        console.error("Failed to fetch budgets:", error);
      }
      setLoading(false);
    };

    fetchBudgets();
  }, []);

  return (
    <StyledWrapper>
      <div className="container">
        <h1>EXPENSE TRACKER</h1>
        <TopContainer>
          <h2>{name}</h2>
          <h2>{email}</h2>
          <h2>Number of Budgets: {n.toString()}</h2>
        </TopContainer>
        <h1>BUDGETS</h1>
        <span>
          <input type="text" placeholder="Budget Name" onChange={handleName} />
          <input type="text" placeholder="Amount" onChange={handleAmount} />
          <button onClick={addBudget}>Add</button>
        </span>
        {loading ? (
          <Loader /> // Replace with a spinner component
        ) : (
          <BottomContainer>
            <ul>
              {budgetList.length ? (
                budgetList.map((budget) => (
                  <li key={budget.id}>
                    <Card
                      budgetAmount={budget.totalAmount.toString()}
                      budgetName={budget.name}
                      handleDelete={() => removeBudget(budget.id)}
                    />
                  </li>
                ))
              ) : (
                <h2>No Budgets Found</h2>
              )}
            </ul>
          </BottomContainer>
        )}
      </div>
    </StyledWrapper>
  );
};

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

export default HomePage;
