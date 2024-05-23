import * as AuthMiddleware from "../middleware/auth";
import * as UserMiddleware from "../middleware/user";
import type { Route } from "../types/infrastructure";

const BASE_PATH = "/auth";

const routes: Route[] = [
	{
		path: `${BASE_PATH}/register`,
		method: "post",
		handler: [UserMiddleware.postUser]
	},
	{
		path: `${BASE_PATH}/login`,
		method: "post",
		handler: [AuthMiddleware.login],
	},
	{
		path: `${BASE_PATH}/refresh`,
		method: "post",
		handler: [AuthMiddleware.refreshAccessToken],
	},
	{
		path: `${BASE_PATH}/:id/password`,
		method: "patch",
		protected: true,
		handler: [AuthMiddleware.patchUserPassword],
	},
];

export { routes };