import styled from 'styled-components';

interface CardObject {
  budgetName: String,
  budgetAmount: String,
  handleDelete: () => void
}

const Card = ({budgetName,budgetAmount,handleDelete}: CardObject) => {
  return (
    <StyledWrapper>
      <div className="card"> 
        <button className="dismiss" type="button" onClick={handleDelete}>×</button> 
        <div className="header">  
          <div className="content">
            <span className="title">{budgetName}</span> 
          </div> 
          <div className="actions">
            {/* <button className="track" type="button">History</button> */}
            <span className="title">{budgetAmount}</span>
            <button className="history" type="button">Open Budget</button> 
          </div> 
        </div> 
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    overflow: hidden;
    position: relative;
    text-align: left;
    border-radius: 0.5rem;
    max-width: 290px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    background-color: #fff;
  }

  .dismiss {
    position: absolute;
    right: 10px;
    top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background-color: #fff;
    color: black;
    border: 2px solid #D1D5DB;
    font-size: 1rem;
    font-weight: 300;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    transition: .3s ease;
  }

  .dismiss:hover {
    background-color: #ee0d0d;
    border: 2px solid #ee0d0d;
    color: #fff;
  }

  .header {
    padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #e2feee;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
    animation: animate .6s linear alternate-reverse infinite;
    transition: .6s ease;
  }
  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #131a15;
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.5rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
  }

  .message {
    margin-top: 0.5rem;
    color: #595b5f;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    margin: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .history {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #67d9ae;
    color: #251313;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    margin-top: 10px;
  }
  .history:hover{
    cursor: pointer;
  }

  .track {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    color: #242525;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #D1D5DB;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  @keyframes animate {
    from {
      transform: scale(1);
    }

    to {
      transform: scale(1.09);
    }
  }`;

export default Card;
