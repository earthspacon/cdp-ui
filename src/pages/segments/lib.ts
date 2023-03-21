import { loyaltyProgramStatuses } from '@/shared/api/segments';
import { orderStatues } from '@/shared/api/status-mappings';

import { Filters, Segment } from './api';

export type LabelValue = { label: string; value: string };

type MappedFilter<Filter> = {
  [filterKey in keyof Filter]: LabelValue;
};

type MappedFilters = {
  [filter in keyof Filters]: MappedFilter<Filters[filter]>;
};

export interface MappedSegment extends Omit<Segment, 'filters'> {
  filters: MappedFilters;
}

export function mapSegments(segments: Segment[]): MappedSegment[] {
  return segments.map((segment) => {
    const { customer, loyalty, order } = segment.filters;

    const mappedCustomer = mapCustomerFilter(customer);
    const mappedOrder = mapOrderFilter(order);
    const mappedLoyalty = mapLoyalFilter(loyalty);

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
  customer: Filters['customer'],
): MappedFilter<Filters['customer']> {
  const { email, birthDate, gender, phoneNumber } = customer;

  const emailValue = getIsEmptyValue(email.isEmpty);
  const phoneValue = getIsEmptyValue(phoneNumber.isEmpty);
  const birthDateValue = `${birthDate.fromDate} - ${birthDate.toDate}`;
  const genderValue = getSexValue(gender.value);

  return {
    email: { label: 'Email', value: emailValue },
    phoneNumber: { label: 'Телефон', value: phoneValue },
    birthDate: { label: 'Дата рождения', value: birthDateValue },
    gender: { label: 'Пол', value: genderValue },
  };
}

function mapOrderFilter(
  order: Filters['order'],
): MappedFilter<Filters['order']> {
  const { date, status, ordersCount, ordersPriceSum } = order;

  const dateValue = `${date.fromDate} - ${date.toDate}`;
  const statusValue = orderStatues[status.value];
  const ordersCountValue = `${ordersCount.fromValue} - ${ordersCount.toValue}`;
  const ordersPriceSumValue = `${ordersPriceSum.fromValue} - ${ordersPriceSum.toValue}`;

  return {
    date: { label: 'Дата заказа', value: dateValue },
    status: { label: 'Статус заказа', value: statusValue },
    ordersCount: { label: 'Количество заказов', value: ordersCountValue },
    ordersPriceSum: { label: 'Сумма заказов', value: ordersPriceSumValue },
  };
}

function mapLoyalFilter(
  loyal: Filters['loyalty'],
): MappedFilter<Filters['loyalty']> {
  const { level, status, amountOfBonuses } = loyal;

  return {
    level: {
      label: 'Уровень лояльности',
      value: level.value,
    },
    status: {
      label: 'Статус лояльности',
      value: loyaltyProgramStatuses[status.value],
    },
    amountOfBonuses: {
      label: 'Количество бонусов',
      value: `${amountOfBonuses.fromValue} - ${amountOfBonuses.toValue}`,
    },
  };
}

function getIsEmptyValue(value: boolean) {
  return value ? 'Пусто' : 'Заполнено';
}
function getSexValue(value: number) {
  return value === 0 ? 'Мужской' : 'Женский';
}
