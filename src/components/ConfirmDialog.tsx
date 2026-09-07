import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import dialogService from "../services/dialog";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmDialog = () => {
  const [confirmProps, setConfirmProps] = useState<ConfirmDialogProps | null>(
    null,
  );

  const showConfirmDialog = useCallback(() => {
    if (!confirmProps) return;
    setConfirmProps({ ...confirmProps, open: true });
  }, [confirmProps]);

  useEffect(() => {
    dialogService().registerConfirm(showConfirmDialog);
  }, [showConfirmDialog]);

  if (!confirmProps?.open) return null;

  if (confirmProps === null) return null;

  return (
    <Card>
      <CardHeader title="Confirm" />
      <CardContent>
        <p>{confirmProps.message}</p>
      </CardContent>
      <CardActions className="flex right-items">
        <Button onClick={confirmProps.onConfirm}>Confirm</Button>
        <Button onClick={confirmProps.onClose}>Cancel</Button>
      </CardActions>
    </Card>
  );
};

export default memo(ConfirmDialog);
