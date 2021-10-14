import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Link, List, ListInput, Navbar, NavRight, NavTitle, Page } from 'framework7-react';
import { map } from 'lodash';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';

import { getItemsFromProvider } from '@api';
import { currency } from '@js/utils';
import i18n from '../../assets/lang/i18n';
import { GetItemsFromProviderOutput, Item, SortState, SortStates } from '@interfaces/item.interface';
import { itemsFromProviderKeys } from '@reactQuery/query-keys';
import { formmatPrice } from '@utils/index';
import { useInView } from 'react-intersection-observer';
import StaticRatingStar from '@components/StaticRatingStar';
import LandingPage from '@pages/landing';

interface ItemsFilterProps {
  sort: SortState;
}

const ManageItemsPage = ({ f7route, f7router }) => {
  const [viewType, setViewType] = useState('grid');
  // const [items, setItems] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { is_main }: { is_main: boolean } = f7route.query;
  const queryClient = useQueryClient();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const filterForm = useFormik<ItemsFilterProps>({
    initialValues: {
      sort: 'created_at desc',
    },

    onSubmit: async () => {
      await queryClient.removeQueries(ITEMS_FROM_PROVIDER_KEY);
      await refetch();
      // const {
      //   data: { ok, items, totalResults },
      // } = await refetch();
      // if (ok) {
      //   setItems(items);
      //   setTotalCount(totalResults);
      //   setCategoryName(categoryName);
      // }
    },
  });
  const ITEMS_FROM_PROVIDER_KEY = itemsFromProviderKeys.list({ ...filterForm.values });

  const {
    fetchNextPage, //
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data,
    error,
    status,
    refetch,
  } = useInfiniteQuery<GetItemsFromProviderOutput, Error>(
    ITEMS_FROM_PROVIDER_KEY, //
    ({ pageParam }) =>
      getItemsFromProvider({
        sort: filterForm.values.sort,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.hasNextPage;
        return hasNextPage ? lastPage.nextPage : false;
      },
      onSuccess: (data) => {
        setTotalCount(data.pages[data.pages.length - 1].totalResults);
      },
    },
  );

  // const { refetch } = useQuery<GetItemsFromProviderOutput, Error>(
  //   ITEMS_FROM_PROVIDER_KEY,
  //   () => getItemsFromProvider({ ...filterForm.values }),
  //   {
  //     enabled: false,
  //   },
  // );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching]);

  // useEffect(() => {
  //   (async () => {
  //     const { ok, items, totalResults } = await getItemsFromProvider({ page: 1 });
  //     if (ok) {
  //       setItems(items);
  //       setTotalCount(totalResults);
  //     }
  //   })();
  // }, []);

  const onRefresh = async (done) => {
    await queryClient.removeQueries(ITEMS_FROM_PROVIDER_KEY);
    await refetch();
    // const { data } = await refetch();
    // setItems(data.items);
    // setTotalCount(data.totalResults);
    done();
  };

  const onClickLink = (e: any, itemId) => {
    f7router.navigate(`/items/${itemId}`, {
      props: {
        itemQeuryKey: ITEMS_FROM_PROVIDER_KEY,
      },
    });
  };

  return (
    <Page //
      noToolbar={!is_main}
      onPtrRefresh={onRefresh}
      ptr
    >
      <Navbar backLink={!is_main}>
        <NavTitle>{'상품 관리'}</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={0} badgeColor="red" />
        </NavRight>
      </Navbar>

      <form onSubmit={filterForm.handleSubmit} className="item-list-form p-3 table w-full border-b">
        <div className="float-left">
          총 <b>{currency((data?.pages[0].totalResults && totalCount) || 0)}</b>개 상품
        </div>
        <ListInput
          type="select"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          name="sort"
          onChange={(e) => {
            filterForm.handleChange(e);
            filterForm.submitForm();
          }}
          value={filterForm.values.sort}
        >
          {map(SortStates, (v, idx) => (
            <option value={v[0]} key={idx}>
              {v[1]}
            </option>
          ))}
        </ListInput>
        <ListInput
          type="select"
          defaultValue="grid"
          className="float-right inline-flex items-center px-2.5 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
          onChange={(e) => setViewType(e.target.value)}
        >
          {map(i18n.t('ui'), (v, k) => (
            <option value={k} key={k}>
              {v}
            </option>
          ))}
        </ListInput>
      </form>
      {status === 'loading' ? (
        <LandingPage />
      ) : status === 'error' ? (
        <span>Error:{error.message}</span>
      ) : (
        <List noHairlines className="mt-0 text-sm font-thin">
          {viewType === 'grid' ? (
            <ul className="flex-wrap grid grid-cols-2">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.items.map((item: Item) => (
                    <div className="relative" key={item.id}>
                      <Link className="block m-1" onClick={(e) => onClickLink(e, item.id)}>
                        <div
                          className="bg-gray-100 py-32 bg-center bg-cover"
                          style={{
                            backgroundImage: `url(${item.product_images[0]})`,
                          }}
                        ></div>
                        <div className="m-1">
                          <div className="font-bold mt-1 mr-1 truncate">{item.name}</div>
                          <div className="text-red-700 text-xl font-bold">{formmatPrice(item.sale_price)}원</div>
                          <div className="flex items-center">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(item.avgRating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-xl"
                              />
                            </div>
                            <div className="text-blue-500 text-base mb-1">({item.reviews.length})</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          ) : (
            <ul className="flex flex-col">
              {data?.pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page.items.map((item: Item) => (
                    <div>
                      <a className="flex gap-1 m-1" onClick={(e) => onClickLink(e, item.id)} key={item.id}>
                        <img src={item.product_images[0]} alt="" className="w-1/4 h-40 mr-4" />
                        <div className="w-3/4">
                          <div className="text-xl font-bold mt-1 line-clamp-2">{item.name}</div>
                          <div className="text-red-700 text-2xl mb-6 font-bold">{formmatPrice(item.sale_price)}원</div>
                          <div className="flex items-center">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(item.avgRating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-xl"
                              />
                            </div>
                            <div className="text-blue-500 text-base mb-1">({item.reviews.length})</div>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          )}
          <div className="flex justify-center font-bold mt-4">
            <div ref={hasNextPage && !isFetching ? ref : null}>
              {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
            </div>
          </div>
        </List>
      )}
    </Page>
  );
};

export default React.memo(ManageItemsPage);
