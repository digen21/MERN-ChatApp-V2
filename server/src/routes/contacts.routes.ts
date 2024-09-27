import express from "express";

import { ContactController } from "../controllers";
import { verifyToken } from "../middlewares";

const contactsRouter = express.Router();

contactsRouter.get("/user-contacts", verifyToken, ContactController.contacts);
contactsRouter.get("/", verifyToken, ContactController.searchContacts);
contactsRouter.get(
  "/get-all-contacts",
  verifyToken,
  ContactController.getAllUsers
);

export default contactsRouter;
