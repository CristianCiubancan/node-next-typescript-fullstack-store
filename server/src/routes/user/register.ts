import express from "express";
import argon2 from "argon2";
import { validateRegsiter } from "../../utils/validateRegister";
import { getConnection } from "typeorm";
import { Req } from "../../types/networkingTypes";
import { User } from "../../entities/User/User";
import { Cluster, Redis } from "ioredis";
import { sendEmail } from "../../utils/sendEmail";
import { createConfirmationUrl } from "../../utils/createConfirmationUrl";

const handleRegister = async (
  req: Req,
  res: express.Response,
  redisClient: Cluster | Redis
) => {
  const { username, email, password, isAdmin } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "invalid arguments" });
  }

  const errors = validateRegsiter(req.body);
  if (errors) {
    return res.json({ errors });
  }

  const hashedPassword = await argon2.hash(password);

  let user;

  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username,
        email,
        password: hashedPassword,
        isAdmin: isAdmin ? true : false,
        confirmed: isAdmin ? false : true,
      })
      .returning("*")
      .execute();
    user = result.raw[0];
  } catch (err) {
    if (err.code === "23505") {
      if (err.detail.includes("email")) {
        return res.json({
          errors: [
            {
              field: "email",
              message: "email is already taken",
            },
          ],
        });
      } else if (err.detail.includes("username")) {
        return res.json({
          errors: [
            {
              field: "username",
              message: "username is already taken",
            },
          ],
        });
      }
    }
  }

  if (isAdmin) {
    sendEmail(
      process.env.OWNER_EMAIL_ADDRESS,
      "New admin just registered for your website",
      `<div>
      <h1>${user.username} signed up as an admin</h1>
      <p>if you do not intend to activate his admin privilages no action is required</p>
      <a href="${
        process.env.CORS_ORIGIN_ADMIN
      }/activate-admin/${await createConfirmationUrl(
        user.id,
        redisClient
      )}">click here to approve this account as an admin</a></div>`
    );

    return res.json({
      message:
        "Your account was registered, you will need to wait for it to get approved, please try loging in again in a brief moment, if it takes more than 2 hours please contact your supervisor.",
    });
  } else {
    req.session.userId = user.id;
    req.session.save();
    return res.json({ user: { ...user, password: "" } });
  }
};

export default handleRegister;
