import express from "express";
import { Req } from "../../types/networkingTypes";
import { COOKIE_NAME } from "../../constants";

const handleLogout = async (req: Req, res: express.Response) => {
  req.session.destroy((err) => {
    res.clearCookie(COOKIE_NAME);
    if (err) {
      return res.json({
        error: { message: "could not log you out", reason: err },
      });
    }
    return res.json(true);
  });
};

export default handleLogout;
