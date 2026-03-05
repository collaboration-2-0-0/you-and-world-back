import cron from 'node-cron';
import { IController, IControllerConfig, ITask } from '@root/controller/types';
import { ControllerError } from '@root/controller/errors';
import { pathToArray } from '@root/utils/utils';

export class TaskRunnerService {
  private cron = cron;

  constructor(
    private config: IControllerConfig,
    private controller: IController,
  ) {}

  init() {
    const { tasks = [] } = this.config;

    for (const task of tasks) {
      this.scheduleTask(task);
    }
  }

  private scheduleTask(task: ITask) {
    const { cronString } = task;

    try {
      this.cron.validate(cronString);
    } catch (e) {
      logger.error(e);
      throw new ControllerError('TASK_ERROR');
    }

    const job = this.createJob(task);

    this.cron.schedule(cronString, job, {}).start();
  }

  private createJob(task: ITask) {
    const { path, params } = task;

    const operation = {
      options: {
        sessionKey: 'admin:scheduler',
        origin: process.env.ORIGIN!,
        isAdmin: true,
      },
      names: pathToArray(path),
      data: { params },
    };

    const job = async () => {
      try {
        await this.controller.exec(operation);
      } catch (e) {
        logger.error(e);
      }
    };

    return job;
  }
}
