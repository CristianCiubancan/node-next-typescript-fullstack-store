import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import React, { LegacyRef, useRef } from "react";

export type WrapperVariant = "small" | "regular";

interface AlertDialogProps {
  message: string;
  functionToExecute: Function;
  title: string;
  isSubmitting: boolean;
}

const AlertDialogButton: React.FC<AlertDialogProps> = ({
  message,
  functionToExecute,
  title,
  isSubmitting,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
  return (
    <Box>
      <Button onClick={onOpen} colorScheme={"red"}>
        Delete
      </Button>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>{title}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{message}</AlertDialogBody>
          <AlertDialogFooter>
            <Button
              ref={cancelRef as LegacyRef<HTMLButtonElement>}
              onClick={onClose}>
              No
            </Button>
            <Button
              onClick={() => {
                functionToExecute();
              }}
              isLoading={isSubmitting}
              colorScheme="red"
              ml={3}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default AlertDialogButton;
