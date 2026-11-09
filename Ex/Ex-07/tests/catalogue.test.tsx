import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Catalogue } from "@/components/catalogue";
import products from "../prisma/products.json";
const fixtures = products.map((p) => ({ ...p, updatedAt: new Date() }));
test("server supplied products are visible with their prices", () => {
  render(<Catalogue products={fixtures} />);
  expect(
    screen.getByRole("heading", { name: "Keychron Q1" }),
  ).toBeInTheDocument();
  expect(screen.getByText("8 sản phẩm")).toBeInTheDocument();
});
test("search filters products case insensitively", async () => {
  const user = userEvent.setup();
  render(<Catalogue products={fixtures} />);
  await user.type(
    screen.getByRole("textbox", { name: "Tìm sản phẩm" }),
    "KEYCHRON",
  );
  expect(
    screen.getByRole("heading", { name: "Keychron Q1" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: /Dell/ }),
  ).not.toBeInTheDocument();
});
test("category filter and clear handle empty results", async () => {
  const user = userEvent.setup();
  render(<Catalogue products={fixtures} />);
  await user.click(screen.getByRole("button", { name: "Âm thanh" }));
  expect(screen.getByText("2 sản phẩm")).toBeInTheDocument();
  await user.type(
    screen.getByRole("textbox", { name: "Tìm sản phẩm" }),
    "missing-item",
  );
  expect(
    screen.getByText("Chưa tìm thấy sản phẩm phù hợp"),
  ).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
  expect(screen.getByText("8 sản phẩm")).toBeInTheDocument();
});

test("price sort changes the visible product order", async () => {
  const user = userEvent.setup();
  render(<Catalogue products={fixtures} />);
  await user.click(screen.getByRole("combobox", { name: "Sắp xếp sản phẩm" }));
  await user.click(screen.getByText("Giá: thấp đến cao"));
  expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
    "Baseus Monitor Light",
  );
  await user.click(screen.getByRole("combobox", { name: "Sắp xếp sản phẩm" }));
  await user.click(screen.getByText("Giá: cao đến thấp"));
  expect(screen.getAllByRole("heading", { level: 3 })[0]).toHaveTextContent(
    "Dell UltraSharp U2723QE",
  );
});
