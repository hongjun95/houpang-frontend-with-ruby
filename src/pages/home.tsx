import React, { useCallback, useEffect, useState } from 'react';
import { Link, Navbar, NavLeft, NavRight, NavTitle, Page } from 'framework7-react';
import { useRecoilState } from 'recoil';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useInView } from 'react-intersection-observer';
import { useFormik } from 'formik';

import { shoppingListAtom } from '@atoms';
import Categories from '@components/Categories';
import useAuth from '@hooks/useAuth';
import { getShoppingList, IShoppingItem } from '@store';
import SearchBar from '@components/SearchBar';
import ItemsList from '@components/ItemsList';
import { GetItemsBySearchTermOutput, SortState } from '@interfaces/item.interface';
import { itemKeys } from '@reactQuery/query-keys';
import { getItemsBySearchTermAPI } from '@api';

interface ItemFilterProps {
  sort: SortState;
}

const HomePage = ({ f7router }) => {
  const { currentUser } = useAuth();
  const [shoppingList, setShoppingList] = useRecoilState<Array<IShoppingItem>>(shoppingListAtom);
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const queryClient = useQueryClient();

  const filterForm = useFormik<ItemFilterProps>({
    initialValues: {
      sort: 'created_at desc',
    },

    onSubmit: async () => {
      await queryClient.removeQueries(ITEM_KEY);
      await refetch();
    },
  });

  const ITEM_KEY = itemKeys.search({ sort: filterForm.values.sort, page, query });

  const {
    hasNextPage, //
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<GetItemsBySearchTermOutput, Error>(
    ITEM_KEY,
    ({ pageParam }) => getItemsBySearchTermAPI({ sort: filterForm.values.sort, page: pageParam, query }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.has_next_page;
        return hasNextPage ? lastPage.next_page : false;
      },
      onSuccess: (data) => {
        if (hasNextPage) {
          setPage(data.pages[0].next_page);
        }
      },
      enabled: !!query,
    },
  );

  const itemsRefetch = useCallback(() => {
    refetch();
  }, []);

  const useSetQuery = useCallback((query) => {
    setQuery(query);
  }, []);

  useEffect(() => {
    setShoppingList(getShoppingList(currentUser?.id));
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, currentUser?.id]);

  const onRefresh = async (done) => {
    await queryClient.removeQueries(ITEM_KEY);
    await itemsRefetch();
    done();
  };

  return (
    <Page name="home" onPtrRefresh={onRefresh} ptr>
      <Navbar>
        <NavLeft>
          <Link icon="las la-bars" panelOpen="left" />
        </NavLeft>
        <NavTitle>Houpang</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={shoppingList.length} badgeColor="red" />
        </NavRight>
      </Navbar>
      <SearchBar query={query} setQuery={useSetQuery} refetch={itemsRefetch} />
      <Categories />
      <ItemsList //
        f7router={f7router}
        status={status}
        error={error}
        data={data}
        ITEM_KEY={ITEM_KEY}
        filterForm={filterForm}
      />
      <div className="flex justify-center font-bold mt-4">
        <div ref={hasNextPage && !isFetching ? ref : null}>
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : ''}
        </div>
      </div>
    </Page>
  );
};
export default React.memo(HomePage);
