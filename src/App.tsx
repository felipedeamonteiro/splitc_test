import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import styled from "styled-components";

import { toBrl } from "./utils/currencry";

const Container = styled.div`
  header {
    padding: 20px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    background: rgb(48, 48, 48);
    .header-div1 {
      color: #fff;
    }

    .header-div2 {
      display: flex;
      align-items: center;
      flex-direction: row;
      h1 {
        margin-right: 10px;
        color: #fff;
      }
      img {
        width: 40px;
      }
    }
  }

  .loading {
    margin-top: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-body {
    margin: 20px 30px;
    padding: 20px 30px;
    border-radius: 15px;
    width: 60%;
    background: #fff;
    box-shadow: 5px 10px 10px #888888;

    h1 {
      margin-bottom: 35px;
    }

    table {
      border-collapse: collapse;
      thead {
        tr {
          background: orange;
          td {
            padding: 5px 20px;
            font-size: 20px;
            font-weight: 700;
            color: black;
          }
        }
      }

      tbody {
        tr:nth-child(even) {
          background: lightgray;
        }
        tr {
          td {
            padding: 5px 20px;
          }
        }
      }
    }

    .total-div {
      display: flex;
      flex-direction: row;
      h3 {
        margin-right: 10px;
      }
      .total-value {
        color: #4343f3;
      }
    }
  }
`;

type PayrollResponse = {
  id: string;
  creditor_name: string;
  company_name: string;
  value: number;
};

const sum = (payload: PayrollResponse[]): number => {
  const finalSum = payload.reduce((prev: number, curr: PayrollResponse) => {
    prev += curr.value;
    return prev;
  }, 0);

  return finalSum;
};

function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState<PayrollResponse[]>([]);

  useEffect(() => {
    async function get() {
      const d = await fetch(
        "https://splitc-public-files-bucket.s3.us-east-1.amazonaws.com/recruitment-challenge-payload.json"
      );
      const json = await d?.json();
      setLoading(false);
      setState(json);
    }
    get();
  }, []);

  return (
    <Container>
      <header>
        <div className="header-div2">
          <h1>SplitC</h1>
          <img src={logo} alt="logo" />
        </div>
        <div className="header-div1">
          <h1>Plataforma de Comissionamento</h1>
        </div>
      </header>
      {isLoading && <div className="loading">Carregando...</div>}
      {!isLoading && (
        <div className="card-body">
          <h1>Confira o pagamento de cada funcionário</h1>
          <table>
            <thead>
              <tr>
                <td>Nome do Funcionário</td>
                <td>Nome da Empresa</td>
                <td>Valor a ser pago</td>
              </tr>
            </thead>
            <tbody>
              {state.map((salary) => (
                <tr key={salary.id + salary.company_name}>
                  <td>{salary.creditor_name}</td>
                  <td>{salary.company_name}</td>
                  <td>{toBrl(salary.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-div">
            <h3>Total a ser pago: </h3>
            <h3 className="total-value">{toBrl(sum(state))}</h3>
          </div>
        </div>
      )}
    </Container>
  );
}

export default App;
