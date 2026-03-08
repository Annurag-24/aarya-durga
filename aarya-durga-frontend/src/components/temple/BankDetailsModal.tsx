import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import type { SiteSetting } from '@/api/settings';

interface BankDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'pooja' | 'donation' | null;
}

const BankDetailsModal = ({ open, onOpenChange, type }: BankDetailsModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { settingsData } = useSettings();
  const [bankDetails, setBankDetails] = useState<{
    accountName: string;
    bankName: string;
    branch: string;
    accountNumber: string;
    ifscCode: string;
    upiId?: string;
  }>({
    accountName: '',
    bankName: '',
    branch: '',
    accountNumber: '',
    ifscCode: '',
  });

  useEffect(() => {
    if (settingsData) {
      const data: SiteSetting = settingsData;
      setBankDetails({
        accountName: data.bank_account_name || '',
        bankName: data.bank_name || '',
        branch: data.bank_branch || '',
        accountNumber: data.bank_account_number || '',
        ifscCode: data.bank_ifsc || '',
        upiId: data.upi_id || undefined,
      });
    } else {
      // Set fallback details
      setBankDetails({
        accountName: 'Aarya Durga Temple Trust',
        bankName: 'Bank of Maharashtra',
        branch: 'Kankavli Branch',
        accountNumber: '',
        ifscCode: '',
      });
    }
  }, [settingsData]);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const BankDetailRow = ({ label, value, copyField }: { label: string; value: string; copyField: string }) => (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="font-mono text-sm text-foreground font-semibold">{value}</p>
      </div>
      <button
        onClick={() => handleCopy(value, copyField)}
        className="ml-4 p-2 rounded-lg hover:bg-primary/10 transition-colors"
        title="Copy to clipboard"
      >
        {copiedField === copyField ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5 text-primary" />
        )}
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-foreground">Bank Account Details</DialogTitle>
          <DialogDescription className="text-xs">
            Please use these details for your donation or temple offering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <BankDetailRow
              label="Account Name"
              value={bankDetails.accountName}
              copyField="accountName"
            />
            <BankDetailRow
              label="Bank"
              value={`${bankDetails.bankName}, ${bankDetails.branch}`}
              copyField="bankName"
            />
            <BankDetailRow
              label="Account Number"
              value={bankDetails.accountNumber}
              copyField="accountNumber"
            />
            <BankDetailRow
              label="IFSC Code"
              value={bankDetails.ifscCode}
              copyField="ifscCode"
            />
          </div>

          <div className="space-y-2">
            <div className="pt-3 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs text-foreground">
                <span className="font-semibold">Note:</span> Click the copy icon next to each detail to copy it to your clipboard.
              </p>
            </div>
            {type === 'pooja' && (
              <div className="pt-3 px-3 py-2 bg-secondary/10 border border-secondary/30 rounded-lg">
                <p className="text-xs text-foreground">
                  <span className="font-semibold">Instructions:</span> Please note the transaction number after completing the payment. Visit the temple with the transaction details, and your Pooja will be performed.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankDetailsModal;
