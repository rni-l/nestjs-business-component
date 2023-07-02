import { SetMetadata } from '@nestjs/common';
import {
  DECORATOR_PAGE_CONTROLLER,
  DECORATOR_RAW_CONTROLLER,
} from '../constants';

export const PageController = () =>
  SetMetadata(DECORATOR_PAGE_CONTROLLER, true);

export const RawController = () => SetMetadata(DECORATOR_RAW_CONTROLLER, true);
