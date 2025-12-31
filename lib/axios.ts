// DEPRECATED shim: `lib/axios.ts` will be removed in a future change.
// Please import from `@/lib/api` instead.
// This file temporarily re-exports the canonical client to maintain compatibility.
import api from './api';

if (typeof window !== 'undefined') {
	// Warn in the browser console if any code still imports this shim.
	// This helps catch remaining usages before fully removing the file.
	// (No-op on server.)
	console.warn('[DEPRECATION] import from "@/lib/axios" is deprecated — use "@/lib/api"');
}

export default api;
