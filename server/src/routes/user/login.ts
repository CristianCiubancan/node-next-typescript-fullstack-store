import express from "express";
import argon2 from "argon2";
import { Req } from "../../types/networkingTypes";
import { User } from "../../entities/User/User";

const handleLogin = async (req: Req, res: express.Response) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({
      error: "invalid arguments",
    });
  }

  const user = await User.findOne(
    usernameOrEmail.includes("@")
      ? { where: { email: usernameOrEmail } }
      : { where: { username: usernameOrEmail } }
  );

  if (!user) {
    return res.json({
      errors: [
        {
          field: "usernameOrEmail",
          message: "username doesn't exist",
        },
      ],
    });
  }

  const valid = await argon2.verify(user.password, password);

  if (!valid) {
    return res.json({
      errors: [
        {
          field: "password",
          message: "password doesn't match",
        },
      ],
    });
  }

  if (user.isAdmin) {
    if (user.confirmed) {
      req.session.userId = user.id;
      req.session.isAdmin = user.isAdmin;
      req.session.save();

      return res.json({ user: { ...user, password: "" } });
    } else {
      return res.json({
        message:
          "Your account is not yet confirmed, if activation took longer than 2 hours please contact your supervisor",
      });
    }
  } else {
    req.session.userId = user.id;
    req.session.save();
    return res.json({ user: { ...user, password: "" } });
  }
};

export default handleLogin;
