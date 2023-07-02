import { SetMetadata } from '@nestjs/common';
import { DECORATOR_OMIT_AUTH } from '../constants';

export const OmitAuth = (val = true) => SetMetadata(DECORATOR_OMIT_AUTH, val);
