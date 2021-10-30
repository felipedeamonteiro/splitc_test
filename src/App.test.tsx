import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import response from "./recruitment-challenge-payload.json";
import App from "./App";

test("renders the company logo", () => {
  const { getByRole } = render(<App />);

  expect(getByRole("img")).toBeInTheDocument();
});

describe("payroll", () => {
  const server = setupServer(
    rest.get(
      "https://splitc-public-files-bucket.s3.us-east-1.amazonaws.com/recruitment-challenge-payload.json",
      (req, res, ctx) => {
        return res(
          ctx.json([
            {
              id: "487e2cbe-602d-4bc0-a4bf-e0d8cfa1fbfb",
              creditor_name: "Ciclano",
              company_name: "CNPJ 1",
              value: 369.1734,
            },
            {
              id: "487e2cbe-602d-4bc0-a4bf-e0d8cfa1fbfb",
              creditor_name: "Ciclano",
              company_name: "CNPJ 2",
              value: 12369.1734,
            },
          ])
        );
      }
    )
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it("shows the payroll title", async () => {
    render(<App />);

    await waitFor(() => screen.getByText(/Confira o pagamento/));
  });

  it("shows the creditor name", async () => {
    render(<App />);

    await waitFor(() => screen.getAllByText(/Ciclano/));
  });

  it("should make the correct sum of total values", async () => {
    render(<App />);

    await waitFor(() => screen.getAllByText("R$ 12.738,35"));
  });
});
