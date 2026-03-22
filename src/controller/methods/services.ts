import { createPathResolve } from '@root/utils/utils';
import { IControllerConfig, IServices } from '../types';
import { SERVICES_MAP } from '../constants';

export const getServices = (config: IControllerConfig) => {
  const { servicesPath, services, modulesConfig } = config;
  const resolvePath = createPathResolve(servicesPath);

  return services.reduce<IServices>((contextObj, service) => {
    const moduleConfig = modulesConfig[service];
    const servicePath = resolvePath(SERVICES_MAP[service]);
    const createService = require(servicePath).default;

    contextObj[service] = createService(moduleConfig, contextObj);

    return contextObj;
  }, {});
};
