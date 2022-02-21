export class UsernamePasswordInput {
  username: string;
  password: string;
  email: string;
}

export const validateRegsiter = (options: UsernamePasswordInput) => {
  if (options.username.length <= 4) {
    return [
      {
        field: "username",
        message: "length must be greater than 4",
      },
    ];
  }
  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email address",
      },
    ];
  }
  if (options.password.length <= 6) {
    return [
      {
        field: "password",
        message: "length must be greater than 6",
      },
    ];
  }
  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "cannot include an @",
      },
    ];
  }
  return null;
};
