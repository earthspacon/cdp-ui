import * as React from 'react';
import {
  Checkbox,
  CircularProgress,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import Autocomplete, {
  autocompleteClasses,
  AutocompleteProps,
  AutocompleteRenderOptionState,
} from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import { emptyCallback } from '@/shared/lib/mappers';
import { ChildrenProp } from '@/shared/types/utility';
import { Centered } from '@/shared/ui/centered';

const LISTBOX_PADDING = 8; // px

type ChildProp = [
  React.HTMLAttributes<HTMLLIElement>,
  string,
  AutocompleteRenderOptionState,
];

type ListChildProps = ListChildComponentProps<ChildProp[]>;

function getRowElements(props: ListChildProps) {
  const { data, index, style } = props;

  const dataSet = data[index];
  console.log(dataSet);
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  const LiElem = ({ children }: ChildrenProp) => (
    <li {...dataSet?.[0]} style={inlineStyle}>
      {children}
    </li>
  );

  return {
    optionData: dataSet ? dataSet[1] : '',
    state: dataSet ? dataSet[2] : null,
    LiElem,
  };
}

function renderLoader(props: ListChildProps) {
  const { LiElem } = getRowElements(props);
  return (
    <LiElem>
      <Centered>
        <CircularProgress />
      </Centered>
    </LiElem>
  );
}

function renderCheckboxRow(props: ListChildProps) {
  const { LiElem, optionData, state } = getRowElements(props);
  return (
    <LiElem>
      <Checkbox checked={state?.selected} />
      {optionData}
    </LiElem>
  );
}

function renderTextRow(props: ListChildProps) {
  const { LiElem, optionData } = getRowElements(props);
  return (
    <LiElem>
      <Typography>{optionData}</Typography>
    </LiElem>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

interface InfiniteListOptions {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  itemsLength: number;
  loadNextPage: () => void;
  optionElemType: 'checkbox' | 'text';
}

function withInfinite({
  hasNextPage,
  isNextPageLoading,
  itemsLength,
  loadNextPage,
  optionElemType,
}: InfiniteListOptions) {
  const itemsCount = hasNextPage ? itemsLength + 1 : itemsLength;
  const loadMoreItems = isNextPageLoading ? emptyCallback : loadNextPage;
  const isItemLoaded = (index: number) => !hasNextPage || index < itemsLength;

  return React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(
    function ListboxComponent(props, ref) {
      const { children, ...other } = props;
      const itemData: React.ReactElement[] = [];
      (children as React.ReactElement[]).forEach(
        (item: React.ReactElement & { children?: React.ReactElement[] }) => {
          itemData.push(item);
          itemData.push(...(item.children || []));
        },
      );
      const itemSize = 50;

      return (
        <div ref={ref}>
          <OuterElementContext.Provider value={other}>
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={itemsCount}
              loadMoreItems={loadMoreItems}
              threshold={5}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  itemData={children as ChildProp[]}
                  height={500}
                  width="100%"
                  outerElementType={OuterElementType}
                  innerElementType="ul"
                  itemSize={itemSize}
                  itemCount={itemsCount}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                >
                  {(props) => {
                    if (optionElemType === 'checkbox') {
                      console.log('checkbox', isNextPageLoading);
                      if (isNextPageLoading) {
                        console.log('isNextPageLoading');
                        return renderLoader(props);
                      }
                      return renderCheckboxRow(props);
                    }
                    return renderTextRow(props);
                  }}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          </OuterElementContext.Provider>
        </div>
      );
    },
  );
}

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: 'border-box',
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
});

interface VirtualizedInfiniteLoadAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends Omit<
      AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
      'renderInput' | 'getOptionLabel'
    >,
    InfiniteListOptions {
  inputLabel?: string;
  getOptionLabel: (option: T) => string;
}

export function VirtualizedInfiniteLoadAutocomplete<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>({
  hasNextPage,
  isNextPageLoading,
  itemsLength,
  loadNextPage,
  optionElemType,
  inputLabel,
  getOptionLabel,
  ...props
}: VirtualizedInfiniteLoadAutocompleteProps<
  T,
  Multiple,
  DisableClearable,
  FreeSolo
>) {
  const ListboxComponent = withInfinite({
    hasNextPage,
    isNextPageLoading,
    itemsLength,
    loadNextPage,
    optionElemType,
  });

  return (
    <Autocomplete
      {...props}
      getOptionLabel={getOptionLabel as (option: T | string) => string}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      renderInput={(params) => <TextField {...params} label={inputLabel} />}
      renderOption={(params, option, state) => {
        console.log({ option });
        return [params, getOptionLabel(option), state] as React.ReactNode;
      }}
    />
  );
}
