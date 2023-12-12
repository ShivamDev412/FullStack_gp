import { Router } from "express";
import endpoints from "../utils/endpoints";
import getHome from "../controllers/homeController";
const { HOME } = endpoints;
const routes = Router();

routes.get(HOME, getHome);

export default routes;
