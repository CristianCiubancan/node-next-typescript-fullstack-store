import React, { InputHTMLAttributes } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import lodash from "lodash";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
  handleChange?: any;
  validation?: RegisterOptions;
  value?: any;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  name,
  validation,
  size: _,
  ...props
}) => {
  let InputOrTextarea = Input;
  if (textarea) {
    InputOrTextarea = Textarea as any;
  }
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = lodash.get(errors, name);

  return (
    <FormControl isInvalid={!!error} width={props.width ? props.width : "100%"}>
      <>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <InputOrTextarea
          {...register(name, { ...validation })}
          {...props}
          id={name}
        />
      </>

      {error ? <FormErrorMessage>{error.message}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default InputField;
