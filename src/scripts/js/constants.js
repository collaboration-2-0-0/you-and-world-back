'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.BUILD_PATH = 'js';
exports.FILES_TO_COPY_FROM_BACK_TO_FRONT =
  exports.EXCLUDE_STATIC =
  exports.EXCLUDE_FROM_BACK =
  exports.FROM_BACK_TO_FRONT =
  exports.FRONT_STATIC_PATH =
  exports.BACK_STATIC_PATH =
  exports.FRONT_PATH =
  exports.BACK_PATH =
    void 0;
const node_path_1 = require('node:path');
exports.BACK_PATH = './src/shared';
exports.FRONT_PATH = '../you-and-world-ui/src/shared';
exports.BACK_STATIC_PATH = './public';
exports.FRONT_STATIC_PATH = '../you-and-world-ui/dist';
exports.FROM_BACK_TO_FRONT = ['server', 'server/types'].map((i) =>
  (0, node_path_1.join)(exports.BACK_PATH, i),
);
exports.EXCLUDE_FROM_BACK = ['local'].map((i) =>
  (0, node_path_1.join)(exports.BACK_PATH, i),
);
exports.EXCLUDE_STATIC = [].map((i) =>
  (0, node_path_1.join)(exports.FRONT_STATIC_PATH, i),
);
exports.FILES_TO_COPY_FROM_BACK_TO_FRONT = [
  ['src/domain/types/util.types.ts', 'local/util.types.ts'],
  ['src/domain/types/db.types.ts', 'local/db.types.ts'],
  ['src/domain/types/net.types.ts', 'local/net.types.ts'],
  ['src/domain/types/member.types.ts', 'local/member.types.ts'],
  ['src/domain/types/user.types.ts', 'local/user.types.ts'],
].map(([i, j]) => [
  (0, node_path_1.resolve)(i),
  (0, node_path_1.join)(exports.FRONT_PATH, j),
]);
//# sourceMappingURL=constants.js.map
