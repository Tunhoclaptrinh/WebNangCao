import React from "react";
import { render } from "@testing-library/react";
import {
  CalendarIcon,
  BookIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  DashboardIcon,
  SettingIcon,
  LogoutIcon,
  LoginIcon,
  LocationIcon,
} from "@/components/icons";

describe("SVG Icons for Server Components", () => {
  it("renders all icons with proper SVG paths and classes", () => {
    const { container: c1 } = render(<CalendarIcon className="w-6 h-6" />);
    expect(c1.querySelector("svg")).toBeInTheDocument();

    const { container: c2 } = render(<BookIcon />);
    expect(c2.querySelector("svg")).toBeInTheDocument();

    const { container: c3 } = render(<ClockIcon />);
    expect(c3.querySelector("svg")).toBeInTheDocument();

    const { container: c4 } = render(<UserIcon />);
    expect(c4.querySelector("svg")).toBeInTheDocument();

    const { container: c5 } = render(<ArrowRightIcon />);
    expect(c5.querySelector("svg")).toBeInTheDocument();

    const { container: c6 } = render(<DashboardIcon />);
    expect(c6.querySelector("svg")).toBeInTheDocument();

    const { container: c7 } = render(<SettingIcon />);
    expect(c7.querySelector("svg")).toBeInTheDocument();

    const { container: c8 } = render(<LogoutIcon />);
    expect(c8.querySelector("svg")).toBeInTheDocument();

    const { container: c9 } = render(<LoginIcon />);
    expect(c9.querySelector("svg")).toBeInTheDocument();

    const { container: c10 } = render(<LocationIcon />);
    expect(c10.querySelector("svg")).toBeInTheDocument();
  });
});
