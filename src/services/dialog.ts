import type { ConfirmDialogProps } from "../components/ConfirmDialog";
type confirmRender = (v: ConfirmDialogProps) => void;
export default function dialogService() {
  let confirmFn: confirmRender;
  return {
    registerConfirm: (fn: confirmRender) => {
      confirmFn = fn;
    },
    confirm: (props: ConfirmDialogProps) => {
      confirmFn({ ...props, open: true });
    },
    closeConfirm: () => {
      confirmFn({ open: false, onClose: () => {}, onConfirm: () => {}, message: "" });
    },
  }
}
