import { Hono } from 'hono';
import type { Bindings } from '../types';

export default function registerAddons(app: Hono<{ Bindings: Bindings }>) {
  console.log('🔌 No addons registered');
}