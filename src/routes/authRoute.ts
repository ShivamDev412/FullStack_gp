import { Router } from "express";
import endpoints from "../utils/endpoints";
import userController from "../controllers/userController";
const routes = Router();
const { LOGIN, SIGNUP, LOGOUT } = endpoints;
const { getLogin, postLogin, getSignup, postSignup, getLogout } =
  userController;

routes.get(LOGIN, getLogin);
routes.post(LOGIN, postLogin);
routes.get(SIGNUP, getSignup);
routes.post(SIGNUP, postSignup);
routes.get(LOGOUT, getLogout);

export default routes;
