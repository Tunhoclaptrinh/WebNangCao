"use client";

import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import { ClockCircleOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

interface CountdownTimerProps {
  dueDate: string;
  isCompleted?: boolean;
}

export function CountdownTimer({ dueDate, isCompleted }: CountdownTimerProps) {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  if (isCompleted) {
    return (
      <Tag icon={<CheckCircleOutlined />} color="success">
        Đã hoàn thành
      </Tag>
    );
  }

  // Calculate live or baseline
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    return (
      <Tag icon={<ExclamationCircleOutlined />} color="error">
        {overdueDays === 0 ? "Hết hạn hôm nay" : `Quá hạn ${overdueDays} ngày`}
      </Tag>
    );
  }

  if (diffDays <= 3) {
    return (
      <Tag icon={<ClockCircleOutlined />} color="warning">
        {diffDays === 0 ? `Hạn chót: Còn ${diffHours}h` : `Còn ${diffDays} ngày (${diffHours}h)`}
      </Tag>
    );
  }

  return (
    <Tag icon={<ClockCircleOutlined />} color="processing">
      Còn {diffDays} ngày
    </Tag>
  );
}
