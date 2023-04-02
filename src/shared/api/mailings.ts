import { createMutation } from '@farfetched/core';

import { API_INSTANCE } from '../config/api-instance';

export function createSendEmailToEmailMutation() {
  return createMutation({
    handler: async (params: SendEmailToEmailParams) => {
      const response = await API_INSTANCE.post(
        '/management-service/mailings/email/by-email',
        params,
      );
      return response.data;
    },
  });
}

export function createSendEmailToSegmentsMutation() {
  return createMutation({
    handler: async (params: SendEmailToSegmentParams) => {
      const response = await API_INSTANCE.post(
        '/management-service/mailings/email/by-segments',
        params,
      );
      return response.data;
    },
  });
}

interface SendEmailParams {
  emailParams: EmailParams;
  conversionParams: ConversionParams;
}

export interface SendEmailToEmailParams extends SendEmailParams {
  toAddress: string;
}

export interface SendEmailToSegmentParams extends SendEmailParams {
  segments: {
    includeSegmentIds: string[];
    excludeSegmentIds: string[];
  };
}

interface EmailParams {
  fromAddress: string;
  subject: string;
  body: string;
}

interface ConversionParams {
  isUTMMarksEnabled: boolean;
}
