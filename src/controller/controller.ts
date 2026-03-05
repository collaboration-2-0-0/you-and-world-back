import {
  THandler,
  IEndpoints,
  TInputModule,
  IContext,
  TOutputModule,
  IController,
  IControllerConfig,
} from './types';
import { IOperation, TOperationResponse } from './operation.types';
import { ControllerError } from './errors';
import { isHandler } from './utils';
import { errorHandler } from './methods/error.handler';
import { createClientApi } from './methods/create.client.api';
import { createInputModules, createOutputModules } from './methods/modules';
import { getServices } from './methods/services';
import { createRoutes } from './methods/create.endpoints';
import { setToGlobal } from '../app/methods/utils';
import * as cryptoService from '../utils/crypto';
import * as domain from '../domain';

class Controller implements IController {
  private endpoints?: IEndpoints;
  private execInputModules?: ReturnType<TInputModule>;
  private execOutputModules?: ReturnType<TOutputModule>;
  private inited = false;

  constructor(private config: IControllerConfig) {}

  async init() {
    try {
      const services = getServices(this.config);
      Object.assign(globalThis, services);
      setToGlobal('cryptoService', cryptoService);
      setToGlobal('domain', domain);
    } catch (e: any) {
      logger.error(e);
      throw new ControllerError('SERVICE_ERROR');
    }

    try {
      this.execInputModules = createInputModules(this.config);
      this.execOutputModules = createOutputModules(this.config);
    } catch (e: any) {
      logger.error(e);
      throw new ControllerError('MODULE_ERROR');
    }

    try {
      const { apiPath, excludeEndpoints } = this.config;
      this.endpoints = await createRoutes(apiPath, excludeEndpoints);
      await createClientApi(this.config, this.endpoints);
    } catch (e: any) {
      logger.error(e);
      throw new ControllerError('ENDPOINTS_CREATE_ERROR');
    }

    this.inited = true;
    return this;
  }

  async exec(operation: IOperation): Promise<TOperationResponse> {
    if (!this.inited) throw new ControllerError('CONTROLLER_ERROR');
    const {
      options: { origin, connectionId, isAdmin },
      names,
    } = operation;
    const context = { origin, connectionId, isAdmin } as IContext;
    const handler = this.findRoute(names);
    try {
      const { data } = await this.execInputModules!(
        operation,
        context,
        handler,
      );
      const response = await handler(context, data.params);
      return await this.execOutputModules!(response, context, handler);
    } catch (e: any) {
      return errorHandler(e);
    } finally {
      await context.session.finalize();
    }
  }

  private findRoute(names: IOperation['names']): THandler {
    let handler: IEndpoints | THandler = this.endpoints!;
    for (const key of names) {
      if (!isHandler(handler) && key in handler) handler = handler[key]!;
      else throw new ControllerError('CANT_FIND_ENDPOINT');
    }
    if (isHandler(handler)) return handler;
    throw new ControllerError('CANT_FIND_ENDPOINT');
  }
}

export = Controller;
