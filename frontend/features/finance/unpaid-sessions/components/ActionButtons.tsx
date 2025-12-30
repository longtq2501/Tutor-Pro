'use client';

import React from 'react';
import { CheckCircle, FileText, Mail } from 'lucide-react';
import { PremiumActionButton } from './PremiumActionButton';

interface ActionButtonsProps {
  selectedSessionsCount: number;
  selectedStudentsCount: number;
  generatingInvoice: boolean;
  sendingEmail: boolean;
  onMarkPaid: () => void;
  onGenerateInvoice: () => void;
  onSendEmail: () => void;
}

export function ActionButtons({
  selectedSessionsCount,
  selectedStudentsCount,
  generatingInvoice,
  sendingEmail,
  onMarkPaid,
  onGenerateInvoice,
  onSendEmail,
}: ActionButtonsProps) {
  const disabled = selectedSessionsCount === 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
      <PremiumActionButton
        icon={CheckCircle}
        label="Đánh dấu đã thanh toán"
        shortLabel="Thanh toán"
        variant="primary"
        onClick={onMarkPaid}
        disabled={disabled}
      />

      <PremiumActionButton
        icon={FileText}
        label="Tải báo giá PDF"
        shortLabel="Tải PDF"
        variant="secondary"
        onClick={onGenerateInvoice}
        disabled={disabled || generatingInvoice}
      />

      <PremiumActionButton
        icon={Mail}
        label="Gửi email nhắc nhở"
        shortLabel="Email"
        variant="tertiary"
        onClick={onSendEmail}
        disabled={disabled || sendingEmail}
      />
    </div>
  );
}