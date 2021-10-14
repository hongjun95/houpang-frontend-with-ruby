import React, { useState } from 'react';
import { Checkbox, Stepper } from 'framework7-react';

import { formmatPrice } from '@utils/index';
import { saveShoppingList, IShoppingItem } from '@store';
import { SetterOrUpdater } from 'recoil';
import { Router } from 'framework7/types';
import { User } from '@interfaces/user.interface';

interface NormalBuyingProps {
  f7router: Router.Router;
  currentUser: User;
  shoppingList: IShoppingItem[];
  setShoppingList: SetterOrUpdater<IShoppingItem[]>;
}

const NormalBuying: React.FC<NormalBuyingProps> = ({ f7router, currentUser, shoppingList, setShoppingList }) => {
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const onClickOrderCount = (e: any) => {
    const id = e.target.name;
    const value = e.target.value;

    const newShoppingList = shoppingList.map<IShoppingItem>((item) => {
      if (item.id === id) {
        return {
          ...item,
          orderCount: value,
        };
      } else {
        return item;
      }
    });

    saveShoppingList(currentUser.id, newShoppingList);
    setShoppingList([...newShoppingList]);
  };

  const plusTotalPrice = (id: string) => {
    shoppingList.forEach((item) => {
      if (item.id === id) {
        setTotalPrice((prev) => prev + item.price * item.orderCount);
      }
    });
  };
  const minusTotalPrice = (id: string) => {
    shoppingList.forEach((item) => {
      if (item.id === id) {
        setTotalPrice((prev) => prev - item.price * item.orderCount);
      }
    });
  };
  const onItemChange = (e: any) => {
    const name = e.target.name;
    if (e.target.checked) {
      items.push(name);
      plusTotalPrice(name);
    } else {
      items.splice(items.indexOf(name), 1);
      minusTotalPrice(name);
    }
    setItems([...items]);
  };
  const onItemsChange = () => {
    if (items.length < shoppingList.length) {
      const checkedNames = shoppingList.map((item) => item.id);
      setItems(checkedNames);
      let total: number = 0;
      shoppingList.forEach((item) => {
        total = total + item.price * item.orderCount;
      });
      setTotalPrice(total);
    } else if (items.length === shoppingList.length) {
      setItems([]);
      setTotalPrice(0);
    }
  };

  const onClickBuy = () => {
    const orderList = shoppingList.filter((item) => items.includes(item.id));

    f7router.navigate('/order', {
      props: {
        orderList,
        totalPrice,
      },
    });
  };

  const onDeleteClick = (e: any, id: string) => {
    const filteredShoppingList = shoppingList.filter((item) => item.id !== id);
    saveShoppingList(currentUser.id, filteredShoppingList);
    setShoppingList([...filteredShoppingList]);
  };
  return (
    <>
      {shoppingList &&
        shoppingList.map((item) => (
          <div className="flex pb-2 border-b border-gray-400 mx-2 my-4" key={item.id}>
            <div className="w-1/4 h-36 mr-4">
              <img src={item.imageUrl} alt="" className="w-full" />
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex mb-4">
                <Checkbox
                  name={item.id}
                  className="mr-2"
                  checked={items.indexOf(item.id) >= 0}
                  onChange={onItemChange}
                />
                <div className="font-bold">{item.name}</div>
              </div>
              <div className="mb-4">
                <span className="font-bold text-lg">{formmatPrice(item.price)}</span>
                <span>원</span>
              </div>
              <div className="flex items-center">
                <button
                  className="w-20 font-medium border py-2 px-4 rounded-md border-gray-300"
                  onClick={(e) => onDeleteClick(e, item.id)}
                >
                  삭제
                </button>
                <Stepper
                  value={item.orderCount}
                  name={item.id}
                  onInput={onClickOrderCount}
                  className="ml-4 text-gray-300 border-gray-200"
                />
              </div>
            </div>
          </div>
        ))}
      <div className="flex fixed bottom-0 border-t-2 botder-gray-600 w-full bg-white">
        <div className="ml-4 mr-2 flex-1 flex justify-between items-center w-full">
          <label className="flex flex-col items-center checkbox">
            <input
              type="checkbox"
              name="buy-all"
              value="전체"
              onChange={onItemsChange}
              checked={items.length === shoppingList.length}
            />
            <i className="icon-checkbox mb-1"></i>
            <span>전체</span>
          </label>
          <div>
            <span>합계: </span>
            <span className="font-bold">{formmatPrice(totalPrice)}</span>
            <span>원</span>
          </div>
        </div>
        <button
          className="flex-1 py-4 border bg-blue-600 text-white font-bold text-base tracking-normal"
          onClick={onClickBuy}
        >
          <span>구매하기 </span>
          <span>({items.length})</span>
        </button>
      </div>
    </>
  );
};

export default React.memo(NormalBuying);
