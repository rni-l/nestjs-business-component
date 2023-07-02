const envMap = {
  development: '.env.development',
  test: '.env.test',
  production: '.env.production',
  local: '.env.local',
};

export const getEnvListByMode = () => {
  const mode = process.env.MODE;
  const target = envMap[mode] ?? envMap.production;
  return [target, '.env'];
};
