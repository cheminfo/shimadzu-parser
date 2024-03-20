import { readFileSync } from 'fs';
import { join } from 'path';

import { parseLabSolutionsGC } from '../parseLabSolutionsGC';

test('test myModule', () => {
  const blob = readFileSync(join(__dirname, 'data/labSolutions_GC.txt'))
  const parsed = parseLabSolutionsGC(blob);
});
