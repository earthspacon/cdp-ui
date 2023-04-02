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
  getOptionLabel: (option: FreeSolo extends true ? string | T : T) => string;
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
      getOptionLabel={getOptionLabel}
      PopperComponent={StyledPopper}
      ListboxComponent={ListboxComponent}
      renderInput={(params) => <TextField {...params} label={inputLabel} />}
      renderOption={(params, option, state) => {
        // this will be passed to the ListboxComponent as children
        return [params, getOptionLabel(option), state] as React.ReactNode;
      }}
    />
  );
}

interface InfiniteListOptions {
  hasNextPage: boolean;
  isNextPageLoading: boolean;
  itemsLength: number;
  loadNextPage: () => void;
  optionElemType: 'checkbox' | 'text';
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

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
                      return renderCheckboxRow({ props, isItemLoaded });
                    }
                    return renderTextRow({ props, isItemLoaded });
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

type ChildProp =
  | [React.HTMLAttributes<HTMLLIElement>, string, AutocompleteRenderOptionState]
  | undefined;

type ListChildProps = ListChildComponentProps<ChildProp[]>;

function getRowElements(props: ListChildProps) {
  const { data, index, style } = props;

  const dataSet = data?.[index];
  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };
  const liProps = dataSet?.[0] ?? {};

  const LiElem = ({ children }: ChildrenProp) => (
    <li {...liProps} style={inlineStyle}>
      {children}
    </li>
  );

  return {
    optionData: dataSet?.[1] ?? '',
    state: dataSet?.[2] ?? null,
    LiElem,
    index,
  };
}

function renderCheckboxRow({
  props,
  isItemLoaded,
}: {
  props: ListChildProps;
  isItemLoaded: (index: number) => boolean;
}) {
  const { LiElem, optionData, state, index } = getRowElements(props);

  let content;
  if (!isItemLoaded(index)) {
    content = (
      <Centered>
        <CircularProgress />
      </Centered>
    );
  } else {
    content = (
      <>
        <Checkbox checked={state?.selected} />
        {optionData}
      </>
    );
  }

  return <LiElem>{content}</LiElem>;
}

function renderTextRow({
  props,
  isItemLoaded,
}: {
  props: ListChildProps;
  isItemLoaded: (index: number) => boolean;
}) {
  const { LiElem, optionData, index } = getRowElements(props);

  let content;
  if (!isItemLoaded(index)) {
    content = (
      <Centered>
        <CircularProgress />
      </Centered>
    );
  } else {
    content = <Typography>{optionData}</Typography>;
  }

  return <LiElem>{content}</LiElem>;
}
