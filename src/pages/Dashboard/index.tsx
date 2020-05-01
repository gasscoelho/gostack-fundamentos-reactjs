import React, { useState, useEffect } from 'react';

import { format } from 'date-fns';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      setTransactions(response.data.transactions);
      setBalance(response.data.balance);
    }

    loadTransactions();
  }, []);

  function capitalize(text: string): string {
    return text[0].toUpperCase() + text.slice(1);
  }

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          {Object.entries(balance).map(([key, value]) => (
            <React.Fragment key={key}>
              <Card total={key === 'total'}>
                <header>
                  <p>{capitalize(key)}</p>
                  <img
                    src={
                      // eslint-disable-next-line no-nested-ternary
                      key === 'income'
                        ? income
                        : key === 'outcome'
                        ? outcome
                        : total
                    }
                    alt={key}
                  />
                </header>
                <h1 data-testid={`balance-${key}`}>
                  {`${formatValue(value)}`}
                </h1>
              </Card>
            </React.Fragment>
          ))}
          {/* <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card> */}
          {/* <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">1.000,00</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">4000,00</h1>
          </Card> */}
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {`${
                      transaction.type === 'outcome' ? '- ' : ''
                    }${formatValue(transaction.value)}`}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>
                    {format(new Date(transaction.created_at), 'dd/MM/yyyy')}
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td className="title">Computer</td>
                <td className="income">5.000,00</td>
                <td>Sell</td>
                <td>20/04/2020</td>
              </tr>
              <tr>
                <td className="title">Website Hosting</td>
                <td className="outcome">- 1.000,00</td>
                <td>Hosting</td>
                <td>19/04/2020</td>
              </tr> */}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
