import { createRoute } from 'atomic-router';

export const routes = {
  root: createRoute(),
  notFound: createRoute(),
  segments: createRoute(),
  login: createRoute(),
  signUp: createRoute(),
};
