import { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Card from "../components/Card"; // Assuming Card is used for budgets
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

// Define your Budget type (if using TypeScript)
type Budget = {
  id: string;
  name: string;
  totalAmount: string;
};

type UserInfo = {
  name: string;
  email: string;
};

const Home = () => {
  const [bname, setBname] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  // Add a new budget
  const addBudget = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const newBudget = {
        name: bname,
        totalAmount: Number(amount),
      };

      const response = await axios.post(
        "http://localhost:3000/api/v1/budget/addBudget",
        newBudget,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Budget added:", response.data);
      // Update UI after successful API call
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

  // Handle changes for the budget name
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBname(e.target.value);
  };

  // Handle changes for the amount
  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  // Remove a budget by id
  const removeBudget = async (budgetId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      await axios.delete(
        `http://localhost:3000/api/v1/budget/deleteBudget/${budgetId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { budgetId },
        }
      );

      console.log(`Budget ${budgetId} deleted`);
      // Update UI after deletion
      setBudgetList((prev) =>
        prev.filter((budget) => budget.id !== budgetId)
      );
    } catch (error: any) {
      console.error(
        "Failed to delete budget:",
        error.response?.data || error.message
      );
    }
    setLoading(false);
  };

  // New handler: Navigate to the Expense page for a specific budget
  const handleCardClick = (budgetId: string) => {
    navigate(`/expense/${budgetId}`);
  };

  // Fetch budgets and user info on component mount
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const result = await axios.get(
          "http://localhost:3000/api/v1/budget/budgets",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Expecting response.data to have user and budgets fields
        setUserInfo(result.data.user);
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
          <h2>UserName: {userInfo.name}</h2>
          <h2>Email: {userInfo.email}</h2>
          <h2>Number of Budgets: {budgetList.length}</h2>
        </TopContainer>
        <h1>BUDGETS</h1>
        <span>
          <input
            type="text"
            placeholder="Budget Name"
            onChange={handleName}
            value={bname}
          />
          <input
            type="text"
            placeholder="Amount"
            onChange={handleAmount}
            value={amount}
          />
          <button onClick={addBudget}>Add</button>
        </span>
        {loading ? (
          <Loader />
        ) : (
          <BottomContainer>
            <ul>
              {budgetList.length ? (
                budgetList.map((budget) => (
                  <li key={budget.id} onClick={() => handleCardClick(budget.id)}>
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

export default Home;
