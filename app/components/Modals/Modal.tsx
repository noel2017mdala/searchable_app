"use client";
import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Buttons from "../Buttons";

type Props = {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryLabel?: string;
  secondaryActonLabel?: string;
};

const Modal = ({
  isOpen,
  onClose,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryLabel,
  secondaryActonLabel,
  onSubmit,
}: Props) => {
  const [showModal, setShowModal] = useState<boolean | undefined>(isOpen);

  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [onSubmit]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) return;

    secondaryAction();
  }, [disabled, secondaryAction]);

  useEffect(() => {
    setShowModal(isOpen);

    const keyDownHandler = (event: any) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    // 👇️ clean up event listener
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
        <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-full lg:h-auto md:h-auto">
          {/* { CONTENT } */}
          <div
            className={`translate duration-300 h-full ${
              showModal
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            <div className="translate h-fit lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/* { HEADER } */}
              <div className="flex items-center p-6 rounded-t justify-center relative border-b[1px]">
                <button
                  className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                  onClick={handleClose}
                >
                  <IoMdClose className="text-black" />
                </button>
                <div className="text-lg font-semibold text-black">{title}</div>
              </div>

              {/* { BODY } */}

              <div className="relative p-6 flex-auto">{body}</div>

              {/* { FOOTER } */}

              <div className="flex flex-col gap-2 p-6">
                <div className="flex flex-row items-center gap-4 w-full">
                  {secondaryAction && secondaryActonLabel && (
                    <Buttons
                      label={secondaryActonLabel}
                      action={handleSecondaryAction}
                      full
                      disabled={disabled}
                    />
                  )}

                  <Buttons
                    label={actionLabel}
                    action={onSubmit}
                    fill
                    full
                    loader={disabled}
                    disabled={disabled}
                  />
                </div>

                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
