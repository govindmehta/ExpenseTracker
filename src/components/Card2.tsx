import styled from 'styled-components';

interface Card{
    name: String,
    amount: Number,
    onDelete: ()=> void
}

const Card2 = ({name, amount, onDelete}: Card) => {
  return (
    <StyledWrapper>
      <div className="cookie-card">
        <span className="cookie-title">{name}</span>
        <p className="cookie-description">{amount.toString()}</p>
        <button className="accept-button" onClick={onDelete}>Delete</button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .cookie-card {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    border-radius: 15px;
    max-width: 200px;
    height: 150px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 1rem;
  }

  .cookie-title {
    font-size: 20px;
    font-weight: bold;
    color: rgb(31 41 55);
  }

  .cookie-description {
    font-size: 15px;
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    color: black
  }

  .accept-button {
    cursor: pointer;
    font-weight: bold;
    border-radius: 5px;
    width: 85px;
    height: 35px;
    background-color: rgba(255, 255, 255, 0);
    color: #fff;
    background-color: rgb(31 41 55);
  }

  .accept-button:hover {
    background-color: #d32121;
    color: #fff;
    border: rgb(31 41 55);
    transition: 0.5s;
  }

  .accept-button:active {
    font-weight: 100;
  }`;

export default Card2;
