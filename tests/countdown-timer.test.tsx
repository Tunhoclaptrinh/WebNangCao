import React from "react";
import { render, screen } from "@testing-library/react";
import { CountdownTimer } from "@/components/countdown-timer";

describe("CountdownTimer Component (Client Island)", () => {
  it("renders 'Đã hoàn thành' when isCompleted is true", () => {
    render(<CountdownTimer dueDate={new Date().toISOString()} isCompleted={true} />);
    expect(screen.getByText("Đã hoàn thành")).toBeInTheDocument();
  });

  it("renders overdue tag when date is past", () => {
    const pastDate = new Date(Date.now() - 5 * 86400000).toISOString();
    render(<CountdownTimer dueDate={pastDate} isCompleted={false} />);
    expect(screen.getByText(/Quá hạn/)).toBeInTheDocument();
  });

  it("renders urgent warning tag when deadline is within 3 days", () => {
    const nearDate = new Date(Date.now() + 2 * 86400000).toISOString();
    render(<CountdownTimer dueDate={nearDate} isCompleted={false} />);
    expect(screen.getByText(/Còn \d+ ngày/)).toBeInTheDocument();
  });

  it("renders upcoming processing tag when deadline is further in the future", () => {
    const futureDate = new Date(Date.now() + 10 * 86400000).toISOString();
    render(<CountdownTimer dueDate={futureDate} isCompleted={false} />);
    expect(screen.getByText(/Còn \d+ ngày/)).toBeInTheDocument();
  });
});
