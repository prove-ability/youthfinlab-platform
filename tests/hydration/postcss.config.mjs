import { resolve } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(resolve("../../apps/admin/package.json"));
export default { plugins: { [require.resolve("@tailwindcss/postcss")]: {} } };
