// Somente a apresentação usa estes dados fictícios. O aplicativo inicia vazio.
export const demo = {
  name: "Camila",
  period: "Setembro",
  income: 480000,
  expenses: 186000,
  goal: {
    name: "Minha próxima viagem",
    current: 360000,
    target: 600000,
    monthly: 60000,
    deadline: "Março de 2027",
  },
  transactions: [
    {
      name: "Projeto independente",
      category: "Renda extra",
      amount: 480000,
      income: true,
      date: "01/09",
    },
    {
      name: "Moradia",
      category: "Casa",
      amount: 120000,
      income: false,
      date: "05/09",
    },
    {
      name: "Mercado da semana",
      category: "Alimentação",
      amount: 42000,
      income: false,
      date: "09/09",
    },
    {
      name: "Mobilidade",
      category: "Transporte",
      amount: 24000,
      income: false,
      date: "12/09",
    },
  ],
  subscriptions: [
    { name: "Internet de casa", amount: 9900, day: "18 set" },
    { name: "Clube de leitura", amount: 2990, day: "22 set" },
  ],
  history: [180000, 220000, 198000, 265000, 294000],
};
export const demoBalance = demo.income - demo.expenses;
