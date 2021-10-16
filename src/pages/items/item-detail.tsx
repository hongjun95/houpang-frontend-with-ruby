import React, { useState } from 'react';
import styled from 'styled-components';
import { f7, Link, Navbar, Page, Sheet, Stepper, Swiper, SwiperSlide } from 'framework7-react';
import { useInfiniteQuery, useQuery } from 'react-query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faPen, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { PageRouteProps } from '@constants';
import { FindItemByIdOutput } from '@interfaces/item.interface';
import { Like } from '@interfaces/like.interface';
import { UserRole } from '@interfaces/user.interface';
import { GetReviewsOnItemOutput } from '@interfaces/review.interface';
import { itemKeys, reviewKeys } from '@reactQuery/query-keys';
import { API_URL, deleteItem, findItemById, getReviewOnItemAPI, likeItemAPI, unlikeItemAPI } from '@api';
import { formmatPrice } from '@utils/index';
import { saveShoppingList, existedItemOnShoppingList, getShoppingList, IShoppingItem } from '@store';
import { likeListAtom, shoppingListAtom } from '@atoms';
import LandingPage from '@pages/landing';
import useAuth from '@hooks/useAuth';
import StaticRatingStar from '@components/StaticRatingStar';
import { formmatDay } from '@utils/formmatDay';

const ItemPrice = styled.div`
  flex: 4 1;
`;

const ItemEditLink = styled.a`
  flex: 2rem 1;
`;

const ItemDeleteBtn = styled.button`
  flex: 2rem 1;
`;

const ItemDetailPage = ({ f7route, f7router }: PageRouteProps) => {
  const [sheetOpened, setSheetOpened] = useState(false);
  const [like, setLike] = useState(false);
  const [orderCount, setOrderCount] = useState<number>(1);
  const [likeList, setLikeList] = useRecoilState<Like>(likeListAtom);
  const setShoppingList = useSetRecoilState<Array<IShoppingItem>>(shoppingListAtom);

  const { currentUser } = useAuth();
  const item_id = f7route.params.id;

  const { data: itemData, status: itemStatus } = useQuery<FindItemByIdOutput, Error>(
    itemKeys.detail(item_id),
    () => findItemById({ item_id: item_id }),
    {
      enabled: !!item_id,
    },
  );

  const {
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    data: reviewData,
    error,
    status: reviewStatus,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery<GetReviewsOnItemOutput, Error>(
    reviewKeys.list({ item_id, page: 1 }),
    ({ pageParam }) =>
      getReviewOnItemAPI({
        item_id,
        page: pageParam,
      }),
    {
      getNextPageParam: (lastPage) => {
        const hasNextPage = lastPage.has_next_page;
        return hasNextPage ? lastPage.next_page : false;
      },
    },
  );

  const onAddItemToShoppingList = () => {
    const shoppingList = getShoppingList(currentUser.id);
    if (existedItemOnShoppingList(currentUser.id, item_id)) {
      f7.dialog.alert('이미 장바구니에 있습니다.');
    } else {
      f7.dialog.alert('장바구니에 담았습니다.');
      const shoppingItem: IShoppingItem = {
        id: item_id,
        name: itemData.item.name,
        price: itemData.item.sale_price,
        imageUrl: !!itemData.item.images[0] ? API_URL + itemData.item.images[0].image_path : '',
        orderCount,
      };
      shoppingList.push({ ...shoppingItem });
      saveShoppingList(currentUser.id, shoppingList);
      setShoppingList(shoppingList);
      f7.dialog.confirm('장바구니로 가시겠습니가?', () => {
        f7router.navigate('/shopping-list');
      });
    }
  };

  const likeItem = async (e) => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    setLike(true);
    setLikeList((prev) => ({
      ...prev,
      items: [...prev.items, { ...itemData.item }],
    }));
    try {
      const { ok, error } = await likeItemAPI({ item_id: item_id });

      if (ok) {
        f7.dialog.alert('찜 했습니다.');
      } else {
        f7.dialog.alert(error);
      }
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.itemData || error?.message);
    }
  };
  const unlikeItem = async (e) => {
    f7.dialog.preloader('잠시만 기다려주세요...');
    setLike(false);
    setLikeList((prev) => ({
      ...prev,
      items: [...prev.items.filter((item) => item.id !== item_id)],
    }));
    try {
      const { ok, error } = await unlikeItemAPI({ item_id: item_id });

      if (ok) {
        f7.dialog.alert('취소 했습니다.');
      } else {
        f7.dialog.alert(error);
      }
      f7.dialog.close();
    } catch (error) {
      f7.dialog.close();
      f7.dialog.alert(error?.response?.itemData || error?.message);
    }
  };

  const onDeleteBtn = async () => {
    try {
      await f7.dialog.confirm('정말로 삭제하시겠습니까?', async () => {
        await deleteItem({ item_id: item_id });
        f7router.navigate(`/items?categoryId=${itemData.item.category.id}`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = () => {
    f7router.navigate('/order', {
      props: {
        orderList: [
          {
            id: itemData.item.id,
            imageUrl: !!itemData.item.images[0] ? API_URL + itemData.item.images[0].image_path : '',
            name: itemData.item.name,
            orderCount,
            price: itemData.item.sale_price,
          },
        ],
        totalPrice: itemData.item.sale_price,
      },
    });
  };

  const onClickLink = (e: any) => {
    f7router.navigate(`/reviews/items/${item_id}`, {
      props: {
        pHasNextPage: hasNextPage,
        pIsFetching: isFetching,
        pIsFetchingNextPage: isFetchingNextPage,
        fetchNextPage,
        refetch,
      },
    });
  };

  const onClickWriteReviewLink = (e: any) => {
    f7router.navigate(`/reviews/write/items/${item_id}`, {
      props: {
        refetch,
      },
    });
  };

  return (
    <Page noToolbar className="min-h-screen">
      <Navbar title="상품상세" backLink={true}></Navbar>

      {itemStatus === 'success' ? (
        <>
          <Swiper pagination className="h-3/4">
            {itemData?.item?.images.map((image) => (
              <SwiperSlide key={Date.now() + image.id}>
                <img src={API_URL + image.image_path} alt="" className="h-full w-full" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="Main__info mx-2 my-4">
            <div className="flex justify-between">
              <div className="flex items-center justify-center w-32">
                <img className="rounded-full mr-2 object-cover w-10 h-10" src={itemData.item.provider.user_img} />
                <div className="w-full">
                  <div>{itemData.item.provider.name}</div>
                  <div className="text-gray-400 text-sm">브랜드</div>
                </div>
              </div>
              {reviewStatus === 'error' ? (
                <span>Error : {error.message}</span>
              ) : (
                reviewStatus === 'success' && (
                  <button onClick={onClickLink} className="flex items-center outline-none">
                    <div className="mr-1">
                      <StaticRatingStar //
                        count={5}
                        rating={Math.ceil(reviewData.pages[0].avg_rating)}
                        color={{
                          filled: '#ffe259',
                          unfilled: '#DCDCDC',
                        }}
                        className="text-xl"
                      />
                    </div>
                    <div className="text-blue-500 text-base mb-1">({reviewData.pages[0].total_results})</div>
                  </button>
                )
              )}
            </div>
            <div className="flex my-4">
              <h1 className="text-xl mr-1 truncate">{itemData.item.name}</h1>
            </div>
            <div className="flex">
              <ItemPrice className="text-red-700 text-xl font-bold">
                {formmatPrice(itemData.item.sale_price)}원
              </ItemPrice>
              {currentUser.id === itemData.item.provider.id && currentUser.role === UserRole.Provider && (
                <>
                  <ItemEditLink
                    className="block w-2 py-1 text-center text-white bg-blue-600 rounded-md mr-2"
                    href={`/items/${item_id}/edit`}
                  >
                    수정
                  </ItemEditLink>
                  <ItemDeleteBtn
                    className="block w-2 py-1 text-center text-white bg-red-600 rounded-md"
                    onClick={onDeleteBtn}
                  >
                    삭제
                  </ItemDeleteBtn>
                </>
              )}
            </div>
          </div>
          <div className="w-full h-3 bg-gray-300"></div>
          <div className="Item__info mx-2 my-4">
            <h2 className="text-lg font-bold border-b-2 border-gray-300 pb-4 mb-4">상품정보</h2>
            <table className="border border-gray-400 w-full">
              <tbody>
                {itemData?.item?.infos?.map((aInfo) => (
                  <tr key={itemData.item.id + aInfo.value}>
                    <td className="bg-gray-200 py-1 pl-2 text-gray-500">{aInfo.key}</td>
                    <td className="numeric-cell py-1 pl-2">{aInfo.value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="bg-gray-200 py-1 pl-2 text-gray-500">후팡 상품 번호</td>
                  <td className="numeric-cell py-1 pl-2">{itemData.item.id}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full h-3 bg-gray-300"></div>
          <div className="pb-20">
            <button
              onClick={onClickLink}
              className="flex justify-between items-center px-4 py-4 border-b border-gray-400 outline-none"
            >
              <h3 className="font-bold text-lg">상품평</h3>
              <FontAwesomeIcon //
                icon={faChevronRight}
                className="text-blue-500 font-bold text-lg"
              />
            </button>
            <div className="px-4 mb-10">
              <div className="flex justify-between py-6">
                <div>
                  {reviewStatus === 'error' ? (
                    <span>Error : {error.message}</span>
                  ) : (
                    reviewStatus === 'success' && (
                      <div className="flex items-center">
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
                        <div className="text-lg">{reviewData.pages[0].total_results}</div>
                      </div>
                    )
                  )}
                </div>
                <div>
                  <button onClick={onClickWriteReviewLink} className="outline-none text-blue-500">
                    <FontAwesomeIcon icon={faPen} className="mr-1 text-xs" />
                    <span>리뷰 작성하기</span>
                  </button>
                </div>
              </div>

              {reviewStatus === 'error' ? (
                <span>Error : {error.message}</span>
              ) : (
                reviewStatus === 'success' &&
                reviewData.pages[0].reviews.length !== 0 && (
                  <>
                    <div className="grid grid-cols-4 gap-1">
                      {reviewData.pages[0].reviews.map((review) => (
                        <img //
                          key={review.id}
                          src={review.images.length !== 0 ? API_URL + review.images[0].image_path : '#'}
                          alt=""
                          className="object-cover object-center h-28 w-full"
                        />
                      ))}
                    </div>
                  </>
                )
              )}
            </div>
            <div className="w-full h-5 bg-gray-200"></div>
            {reviewStatus === 'error' ? (
              <span>Error : {error.message}</span>
            ) : (
              reviewStatus === 'success' &&
              reviewData.pages[0].reviews.length !== 0 && (
                <>
                  <div>
                    {reviewData.pages[0].reviews.map((review) => (
                      <a key={review.id} href="#" className="block py-3 px-4 border-b border-gray-300">
                        <div className="font-semibold">{review.commenter.name}</div>
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
                        <div className="flex">
                          <img //
                            src={review.images.length !== 0 ? API_URL + review.images[0].image_path : '#'}
                            alt=""
                            className="object-cover object-center h-24 w-24 mr-1"
                          />
                          <p className="line-clamp-4 ml-2 h-full">{review.content}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="border-2 border-blue-500 text-blue-500 font-semibold mx-4 flex justify-center py-2 mb-2 mt-4">
                    <button onClick={onClickLink} className="outline-none">
                      이 상품의 상품평 모두보기
                    </button>
                  </div>
                </>
              )
            )}
          </div>
          <div className="flex fixed bottom-0 border-t-2 botder-gray-600 w-full p-2 bg-white">
            {like || (likeList.items && likeList.items?.find((item) => item.id === item_id)) ? (
              <i className="f7-icons cursor-pointer m-3 text-red-500" onClick={unlikeItem}>
                heart_fill
              </i>
            ) : (
              <i className="f7-icons cursor-pointer m-3 text-gray-500" onClick={likeItem}>
                heart
              </i>
            )}

            <button
              className="sheet-open border-none focus:outline-none mr-4 bg-blue-600 text-white font-bold text-base tracking-normal  rounded-md actions-open"
              data-sheet=".buy"
            >
              구매하기
            </button>
          </div>
          <Sheet
            className="buy p-2 h-52"
            opened={sheetOpened}
            closeByOutsideClick
            onSheetClosed={() => {
              setSheetOpened(false);
            }}
          >
            <div className="flex justify-between">
              <h3 className="text-lg font-bold mt-2 truncate">{itemData.item.name}</h3>
              <Link sheetClose>
                <FontAwesomeIcon icon={faTimes} className="text-lg" />
              </Link>
            </div>
            <div className="text-red-700 text-sm font-bold my-2">{formmatPrice(itemData.item.sale_price)}원</div>
            <Stepper
              value={orderCount}
              onStepperChange={setOrderCount}
              className="my-4 text-gray-300 border-gray-200"
            />
            <div className="flex">
              <button
                className={`outline-none border font-bold text-base tracking-normal rounded-md p-2 mr-2 ${
                  existedItemOnShoppingList(currentUser.id, item_id)
                    ? 'border-gray-300 text-gray-300 pointer-events-none'
                    : 'border-blue-600 text-blue-600'
                }`}
                onClick={onAddItemToShoppingList}
                disabled={existedItemOnShoppingList(currentUser.id, item_id)}
              >
                장바구니에 담기
              </button>
              <button //
                className="outline-none border-none bg-blue-600 text-white font-bold text-base tracking-normal rounded-md p-2 ml-2"
                onClick={onClickBuy}
              >
                바로구매
              </button>
            </div>
          </Sheet>
        </>
      ) : (
        <LandingPage />
      )}
    </Page>
  );
};

export default React.memo(ItemDetailPage);
