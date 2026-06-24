import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import client from '@/api/client';
import { constructImageUrl } from '@/api/imageUrl';

interface BankDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'pooja' | 'donation' | null;
}

interface BankDetail {
  id: number;
  account_name: string;
  bank_name: string;
  branch: string;
  account_number: string;
  ifsc_code: string;
  upi_id?: string;
  qr_image?: { file_url?: string };
  qrImage?: { file_url?: string };
  sort_order: number;
}

const BankDetailsModal = ({ open, onOpenChange, type }: BankDetailsModalProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);

  useEffect(() => {
    if (!open) return;
    client
      .get('/public/bank-details')
      .then((response) => setBankDetails(response.data as BankDetail[]))
      .catch(() => setBankDetails([]));
  }, [open]);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const BankDetailRow = ({ label, value, copyField }: { label: string; value: string; copyField: string }) => (
    <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 rounded border border-border hover:bg-muted/50 transition-colors">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-mono text-sm text-foreground font-semibold">{value}</p>
      </div>
      <button
        onClick={() => handleCopy(value, copyField)}
        className="ml-3 p-1.5 rounded hover:bg-primary/10 transition-colors"
        title="Copy to clipboard"
      >
        {copiedField === copyField ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-primary" />
        )}
      </button>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-foreground">Bank Account Details</DialogTitle>
          <DialogDescription className="text-xs">
            Please use these details for your donation or temple offering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {bankDetails.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Bank details will be available soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bankDetails.map((account, accountIdx) => (
              <div key={account.id} className="bg-accent rounded-lg p-4 shadow-md border border-border space-y-2">
                {bankDetails.length > 1 && (
                  <p className="font-heading text-base font-semibold text-foreground">
                    Account {accountIdx + 1}
                  </p>
                )}
                {account.account_name && (
                  <BankDetailRow
                    label="Account Name"
                    value={account.account_name}
                    copyField={`accountName-${account.id}`}
                  />
                )}
                {(account.bank_name || account.branch) && (
                  <BankDetailRow
                    label="Bank"
                    value={[account.bank_name, account.branch].filter(Boolean).join(', ')}
                    copyField={`bankName-${account.id}`}
                  />
                )}
                {account.account_number && (
                  <BankDetailRow
                    label="Account Number"
                    value={account.account_number}
                    copyField={`accountNumber-${account.id}`}
                  />
                )}
                {account.ifsc_code && (
                  <BankDetailRow
                    label="IFSC Code"
                    value={account.ifsc_code}
                    copyField={`ifscCode-${account.id}`}
                  />
                )}
                {account.upi_id && (
                  <BankDetailRow
                    label="UPI ID"
                    value={account.upi_id}
                    copyField={`upiId-${account.id}`}
                  />
                )}
                {(() => {
                  const qr = account.qr_image || account.qrImage;
                  return qr?.file_url ? (
                    <div className="flex flex-col items-center gap-2 rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">Scan to pay</p>
                      <img
                        src={constructImageUrl(qr.file_url)}
                        alt="Payment QR code"
                        className="h-32 w-32 object-contain bg-white rounded"
                      />
                    </div>
                  ) : null;
                })()}
              </div>
            ))}
            </div>
          )}

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
