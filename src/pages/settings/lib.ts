import {
  ApiStatusMappings,
  OrderStatus,
  OrderStatusLabel,
} from '@/shared/api/status-mappings';

export type StatusMappings = Omit<
  ApiStatusMappings['mappings'][0],
  'cdpStatus'
> & {
  id: string;
  cdpStatus: OrderStatus;
  cdpStatusLabel: OrderStatusLabel;
};

export const noCdpStatusErrorMessage =
  'Для каждого статуса в магазине должен быть задан статус в CDP';
export const noExternalStatusErrorMessage =
  'Статус в магазине не может быть пустой строкой или содержать одни пробелы';

export function isExternalStatusValid(externalStatus: string) {
  return externalStatus.trim().length > 0;
}

export function isCdpStatusValid(cdpStatus: OrderStatus) {
  return cdpStatus !== 'NO_STATUS';
}

export function isExternalStatusNotValid(mapping: StatusMappings) {
  const externalStatusValid = isExternalStatusValid(mapping.externalStatus);
  const cdpStatusValid = isCdpStatusValid(mapping.cdpStatus);

  if (!externalStatusValid && !cdpStatusValid) {
    return false;
  }

  if (!externalStatusValid) return true;

  return false;
}

export function isCdpStatusNotValid(mapping: StatusMappings) {
  const externalStatusValid = isExternalStatusValid(mapping.externalStatus);
  const cdpStatusValid = isCdpStatusValid(mapping.cdpStatus);

  if (!externalStatusValid && !cdpStatusValid) {
    return false;
  }

  if (!cdpStatusValid) return true;

  return false;
}
