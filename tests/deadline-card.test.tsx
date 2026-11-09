import React from "react";
import { render, screen } from "@testing-library/react";
import { DeadlineCard } from "@/components/deadline-card";
import type { Deadline } from "@/types";

jest.mock("@/features/deadlines/actions", () => ({
  toggleCompletionAction: jest.fn(),
}));

const mockDeadline: Deadline = {
  id: "dl_test_01",
  title: "Xây dựng REST API với Node.js",
  description: "Thiết kế và triển khai 5 endpoint REST API",
  subjectId: "sub_int1411",
  subjectName: "Lập trình Web nâng cao",
  subjectSlug: "lap-trinh-web-nang-cao",
  dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
  priority: "high",
  format: "GitHub Repo",
  maxScore: 10,
  requirements: ["Clean code", "Unit test"],
  status: "open",
};

describe("DeadlineCard Component", () => {
  it("renders deadline information correctly", () => {
    render(<DeadlineCard deadline={mockDeadline} />);

    expect(screen.getByText("Xây dựng REST API với Node.js")).toBeInTheDocument();
    expect(screen.getByText("Lập trình Web nâng cao")).toBeInTheDocument();
    expect(screen.getByText(/GitHub Repo/)).toBeInTheDocument();
  });

  it("shows mark-completed button when canToggle is true", () => {
    render(<DeadlineCard deadline={mockDeadline} canToggle={true} isCompleted={false} />);
    expect(screen.getByText("Đánh dấu xong")).toBeInTheDocument();
  });

  it("shows undo button when isCompleted is true and canToggle is true", () => {
    render(<DeadlineCard deadline={mockDeadline} canToggle={true} isCompleted={true} />);
    expect(screen.getByText("Đã nộp")).toBeInTheDocument();
  });
});
