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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg text-foreground">Bank Account Details</DialogTitle>
          <DialogDescription className="text-xs">
            Please use these details for your donation or temple offering
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {bankDetails.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Bank details will be available soon.
            </p>
          ) : (
            bankDetails.map((account, accountIdx) => (
              <div key={account.id} className="space-y-3">
                {bankDetails.length > 1 && (
                  <p className="font-semibold text-sm text-foreground">
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
                        className="h-48 w-48 object-contain bg-white rounded"
                      />
                    </div>
                  ) : null;
                })()}
              </div>
            ))
          )}

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
