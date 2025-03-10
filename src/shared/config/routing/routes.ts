import { createRoute } from 'atomic-router';

export const routes = {
  root: createRoute(),
  notFound: createRoute(),
  login: createRoute(),
  signUp: createRoute(),
  integration: createRoute(),
  segments: createRoute(),
  createSegment: createRoute(),
  mailings: createRoute(),
  settings: createRoute(),
};
