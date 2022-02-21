import express from "express";
import { Session, SessionData } from "express-session";

export type Req = express.Request & {
  session: Session &
    Partial<SessionData> & { userId?: number; isAdmin?: boolean };
};
