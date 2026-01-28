import { Button } from "../button/Button";
import { CloseIcon } from "@/assets/CloseIcon";
import { CheckIcon } from "@/assets/CheckIcon";

export type ModalProps = {
  handleAction: () => void;
  setIsModalOpen: (isOpen: boolean) => void;
  title: string;
};

export default function Modal({
  handleAction,
  setIsModalOpen,
  title,
}: ModalProps) {
  return (
    <div className="w-screen h-screen bg-black/60 top-0 left-0 fixed z-100 flex items-center justify-center">
      <div className="flex flex-col bg-section-bg border border-input-border rounded-2xl p-10 items-center justify-center gap-10 max-w-9/10">
        <h3 className="text-primary-text">{title}</h3>
        <div className="flex gap-10">
          <Button
            icon={<CheckIcon className="w-5 shrink-0" />}
            onClick={handleAction}
          >
            Yes
          </Button>
          <Button
            icon={<CloseIcon className="w-5 shrink-0" />}
            variant="secondary"
            onClick={() => setIsModalOpen(false)}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
}
