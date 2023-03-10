import { createRoute } from 'atomic-router';

export const routes = {
  root: createRoute(),
  notFound: createRoute(),
  login: createRoute(),
  signUp: createRoute(),
  segments: createRoute(),
  integration: createRoute(),
};
