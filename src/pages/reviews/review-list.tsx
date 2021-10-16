import React, { useEffect, useState } from 'react';
import { Navbar, Page } from 'framework7-react';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
  useQueryClient,
} from 'react-query';
import { useInView } from 'react-intersection-observer';

import { PageRouteProps } from '@constants';
import { FindItemByIdOutput } from '@interfaces/item.interface';
import { itemKeys, reviewKeys } from '@reactQuery/query-keys';
import { GetReviewsOnItemOutput } from '@interfaces/review.interface';
import StaticRatingStar from '@components/StaticRatingStar';
import { formmatDay } from '@utils/formmatDay';
import { API_URL } from '@api';

interface ReviewListPageProps extends PageRouteProps {
  pHasNextPage: boolean;
  pIsFetching: boolean;
  pIsFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<GetReviewsOnItemOutput, Error>>;
  refetch(options?: RefetchOptions): Promise<QueryObserverResult<InfiniteData<GetReviewsOnItemOutput>, Error>>;
}

const ReviewListPage = ({
  f7route,
  pHasNextPage,
  pIsFetching,
  pIsFetchingNextPage,
  f7router,
  fetchNextPage,
  refetch,
}: ReviewListPageProps) => {
  const [hasNextPage, setHasNextPage] = useState<boolean>(pHasNextPage);
  const [isFetching, setIsFetching] = useState<boolean>(pIsFetching);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(pIsFetchingNextPage);

  const item_id = f7route.params.id;
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const queryClient = useQueryClient();
  const itemData = queryClient.getQueryData<FindItemByIdOutput>(itemKeys.detail(item_id));
  const reviewData = queryClient.getQueryData<InfiniteData<GetReviewsOnItemOutput>>(
    reviewKeys.list({ page: 1, item_id }),
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetching && entry.isIntersecting) {
      fetchNextPage().then((res) => {
        setHasNextPage(res.hasNextPage);
        setIsFetching(res.isFetching);
        setIsFetchingNextPage(res.isFetchingNextPage);
      });
    }
  }, [inView, hasNextPage, isFetching]);

  const onClickWriteReviewLink = (e: any) => {
    f7router.navigate(`/reviews/write/items/${item_id}`, {
      props: {
        refetch,
      },
    });
  };

  console.log(reviewData);

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="상품리뷰" backLink={true}></Navbar>

      <div className="pb-20">
        <div className="px-4 mb-10">
          <div className="py-6">
            {reviewData.pages.length !== 0 && (
              <div className="flex items-center justify-between">
                <div className="mr-1">
                  <StaticRatingStar //
                    count={5}
                    rating={Math.ceil(reviewData.pages[0].avg_rating)}
                    color={{
                      filled: '#ffe259',
                      unfilled: '#DCDCDC',
                    }}
                    className="text-2xl"
                  />
                </div>
                <div className="text-2xl">{reviewData.pages[0].total_results}</div>
              </div>
            )}
          </div>

          {reviewData.pages.length !== 0 && (
            <ul className="grid grid-cols-4 gap-1">
              {reviewData.pages[0].reviews.map((review) => (
                <img //
                  src={review.images.length !== 0 ? API_URL + review.images[0].image_path : '#'}
                  alt=""
                  className="object-cover object-center h-28 w-full"
                />
              ))}
            </ul>
          )}
        </div>
        <div className="w-full h-5 bg-gray-200"></div>
        {reviewData.pages.length !== 0 && (
          <>
            <ul>
              {reviewData.pages.map((page, index) => (
                <>
                  {page.reviews.map((review) => (
                    <div className="py-3 px-4 border-b border-gray-300">
                      <div className="flex items-center">
                        <img //
                          src={review.commenter.user_img}
                          alt=""
                          className="object-cover object-center h-16 w-16 mr-3 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-lg">{review.commenter.name}</div>
                          <div className="flex items-center my-1">
                            <div className="mr-1">
                              <StaticRatingStar //
                                count={5}
                                rating={Math.ceil(review.rating)}
                                color={{
                                  filled: '#ffe259',
                                  unfilled: '#DCDCDC',
                                }}
                                className="text-lg"
                              />
                            </div>
                            <div className="text-sm">{formmatDay(review.created_at)}</div>
                          </div>
                        </div>
                      </div>
                      <a href={`/items/${itemData.item.id}`} className="text-blue-500 my-2 truncate mt-2 w-full">
                        {itemData.item.name}
                      </a>
                      <div className="flex my-2">
                        {review.images.length !== 0 &&
                          review.images.map((image) => (
                            <img //
                              src={API_URL + image.image_path}
                              alt=""
                              className="object-cover object-center h-20 w-20 mr-1"
                            />
                          ))}
                      </div>
                      <p className="h-full">{review.content}</p>
                    </div>
                  ))}
                </>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="flex justify-center font-bold mt-4 pb-10">
        <div //
          ref={hasNextPage && !isFetching ? ref : null}
          className=""
        >
          {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
        </div>
      </div>
      <div className="flex fixed bottom-0 border-t-2 botder-gray-600 w-full p-2 bg-white">
        <button
          // href={`/reviews/write/items/${item_id}`}
          onClick={onClickWriteReviewLink}
          className="flex items-center justify-center h-10 w-full border-none outline-none bg-blue-600 text-white font-bold text-base tracking-normal rounded-md"
        >
          <span>리뷰 작성하기</span>
        </button>
      </div>
    </Page>
  );
};

export default React.memo(ReviewListPage);
