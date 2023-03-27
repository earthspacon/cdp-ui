import {
  genderNumberToLabelMapping,
  hasValueBoolToLabelMapping,
  loyaltyProgramStatuses,
} from '@/shared/api/segments';
import { orderStatues } from '@/shared/api/status-mappings';
import { LabelValue } from '@/shared/types/utility';

import { Filters, Segment } from './api';

type MappedFilter<Filter> = {
  [filterKey in keyof Filter]: LabelValue<string>;
};

type MappedFilters = {
  [filter in keyof Filters]: MappedFilter<Filters[filter]>;
};

const noDataLabel = 'Нет данных';

export interface MappedSegment extends Omit<Segment, 'filters'> {
  filters: MappedFilters;
}

export function mapSegments(segments: Segment[]): MappedSegment[] {
  return segments.map((segment) => {
    const { customer, loyalty, order } = segment.filters;

    const mappedCustomer = customer ? mapCustomerFilter(customer) : null;
    const mappedOrder = order ? mapOrderFilter(order) : null;
    const mappedLoyalty = loyalty ? mapLoyaltyFilter(loyalty) : null;

    return {
      ...segment,
      filters: {
        customer: mappedCustomer,
        order: mappedOrder,
        loyalty: mappedLoyalty,
      },
    };
  });
}

function mapCustomerFilter(
  customer: Exclude<Filters['customer'], null>,
): MappedFilter<Exclude<Filters['customer'], null>> {
  const { email, birthDate, gender, phoneNumber } = customer;

  const emailValue = email
    ? hasValueBoolToLabelMapping[email.isEmpty ? 'true' : 'false']
    : noDataLabel;
  const phoneValue = phoneNumber
    ? hasValueBoolToLabelMapping[phoneNumber.isEmpty ? 'true' : 'false']
    : noDataLabel;
  const birthDateValue = birthDate
    ? `${birthDate.fromDate} - ${birthDate.toDate}`
    : noDataLabel;
  const genderValue = gender
    ? genderNumberToLabelMapping[gender.value]
    : noDataLabel;

  return {
    email: { label: 'Email', value: emailValue },
    phoneNumber: { label: 'Телефон', value: phoneValue },
    birthDate: { label: 'Дата рождения', value: birthDateValue },
    gender: { label: 'Пол', value: genderValue },
  };
}

function mapOrderFilter(
  order: Exclude<Filters['order'], null>,
): MappedFilter<Exclude<Filters['order'], null>> {
  const { date, status, ordersCount, ordersPriceSum } = order;

  const dateValue = date ? `${date.fromDate} - ${date.toDate}` : noDataLabel;
  const statusValue = status ? orderStatues[status.value] : noDataLabel;
  const ordersCountValue = ordersCount
    ? `${ordersCount.fromValue} - ${ordersCount.toValue}`
    : noDataLabel;
  const ordersPriceSumValue = ordersPriceSum
    ? `${ordersPriceSum.fromValue} - ${ordersPriceSum.toValue}`
    : noDataLabel;

  return {
    date: { label: 'Дата заказа', value: dateValue },
    status: { label: 'Статус заказа', value: statusValue },
    ordersCount: { label: 'Количество заказов', value: ordersCountValue },
    ordersPriceSum: { label: 'Сумма заказов', value: ordersPriceSumValue },
  };
}

function mapLoyaltyFilter(
  loyal: Exclude<Filters['loyalty'], null>,
): MappedFilter<Exclude<Filters['loyalty'], null>> {
  const { level, status, amountOfBonuses } = loyal;

  return {
    level: {
      label: 'Уровень лояльности',
      value: level ? level.value : noDataLabel,
    },
    status: {
      label: 'Статус лояльности',
      value: status ? loyaltyProgramStatuses[status.value] : noDataLabel,
    },
    amountOfBonuses: {
      label: 'Количество бонусов',
      value: amountOfBonuses
        ? `${amountOfBonuses.fromValue} - ${amountOfBonuses.toValue}`
        : noDataLabel,
    },
  };
}
