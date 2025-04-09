import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { User } from "@/core/domain/entity/user.entity";
import EditUserForm from "./EditUserForm";

interface EditUserDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

export const EditUserDialog = ({
  user,
  isOpen,
  onClose,
}: EditUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifique los datos del usuario según sea necesario
          </DialogDescription>
        </DialogHeader>
        <EditUserForm user={user} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};
