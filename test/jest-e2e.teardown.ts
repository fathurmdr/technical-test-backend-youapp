import { clearTestData } from './utils/common';

export default async () => {
  await clearTestData();
  return console.log('teardown completed');
};
