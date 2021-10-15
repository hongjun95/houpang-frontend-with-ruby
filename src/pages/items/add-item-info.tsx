import React, { useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import i18next from 'i18next';
import { random } from 'lodash';

import { f7, List, ListInput, Navbar, Page } from 'framework7-react';
import { PageRouteProps } from '@constants';
import { addItemAPI, uploadImages, uploadMultipleImages } from '@api';
import { useRecoilValue } from 'recoil';
import { itemCategoryNameAtom, itemImgFilesAtom, itemNameAtom, itemPriceAtom, itemStockAtom } from '@atoms';
import { InfoItem } from '@interfaces/item.interface';
import { mapValues } from 'lodash';

const AddItemInfoSchema = Yup.object().shape({
  infos: Yup.lazy((obj) =>
    Yup.array()
      .of(
        Yup.object(
          mapValues(obj, () =>
            Yup.object({
              a: Yup.string(),
              b: Yup.string(),
            }),
          ),
        ),
      )
      .optional(),
  ),
});

interface IInfoArray {
  id: number;
}

const AddItemInfoPage = ({ f7router }: PageRouteProps) => {
  const [infos, setInfosNumber] = useState<IInfoArray[]>([]);
  const itemName = useRecoilValue(itemNameAtom);
  const itemPrice = useRecoilValue(itemPriceAtom);
  const itemCategoryName = useRecoilValue(itemCategoryNameAtom);
  const itemStock = useRecoilValue(itemStockAtom);
  const itemImgFiles = useRecoilValue(itemImgFilesAtom);

  const initialValues = {};

  const handleAddItem = async (values, setSubmitting) => {
    setSubmitting(false);
    f7.dialog.preloader('잠시만 기다려주세요...');
    try {
      const { ...rest } = values;

      const submittedInfoObjects = infos.map<InfoItem>((info) => ({
        id: info.id,
        key: rest[`${info.id}-infoKey`],
        value: rest[`${info.id}-infoValue`],
      }));

      try {
        const { ok, error, item } = await addItemAPI({
          item: {
            name: itemName,
            sale_price: itemPrice,
            stock: itemStock,
            infos: submittedInfoObjects,
          },
          category_name: itemCategoryName,
        });

        if (ok) {
          let promises;
          if (itemImgFiles.length !== 0) {
            promises = itemImgFiles.map((image) => {
              const formBody = new FormData();
              formBody.append('imagable_id', item.id);
              formBody.append('imagable_type', 'Item');
              formBody.append('files', image);
              uploadImages(formBody);
            });
          }
          await Promise.all(promises);
          f7.dialog.alert('상품을 성공적으로 추가했습니다.');
          f7router.navigate(`/items/${item.id}`);
        } else {
          f7.dialog.alert(error);
        }
        f7.dialog.close();
      } catch (error) {
        f7.dialog.close();
        f7.dialog.alert(error?.response?.data || error?.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const addInfoBtn = () => {
    setInfosNumber((infos) => [
      ...infos,
      {
        id: Date.now(),
        key: '',
        value: '',
      },
    ]);
  };

  return (
    <Page>
      <Navbar title="상품 추가" backLink sliding={false} />
      <div className="p-4 mx-2 bg-gray-200">
        <div className="flex justify-between border-black border-t pt-4">
          <div className="p-3 font-semibold text-center">상품 정보</div>
          <div className="w-32 flex items-center">
            <button onClick={addInfoBtn} className="p-2 rounded-lg text-white bg-blue-400">
              상품 정보 추가
            </button>
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={AddItemInfoSchema}
          onSubmit={(values, { setSubmitting }) => handleAddItem(values, setSubmitting)}
          validateOnMount
        >
          {({ handleChange, handleBlur, setFieldValue, isSubmitting, isValid }) => (
            <Form>
              <List noHairlinesMd>
                <div className="p-3 flex flex-col mb-10">
                  {infos.length !== 0 &&
                    infos.map((info) => (
                      <ul key={info.id} className="flex border border-gray-2">
                        <ListInput
                          label={i18next.t('item.infoKey') as string}
                          type="text"
                          name={`${info.id}-infoKey`}
                          placeholder="상품 정보 이름 입력"
                          clearButton
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoKey`, e.target.value);
                          }}
                          onBlur={handleBlur}
                        />
                        <ListInput
                          label={i18next.t('item.infoValue') as string}
                          type="text"
                          name={`${info.id}-infoValue`}
                          placeholder="상품 정보 내용 입력"
                          clearButton
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setFieldValue(`${info.id}-infoValue`, e.target.value);
                          }}
                        />
                      </ul>
                    ))}
                </div>
              </List>

              <div className="p-4">
                <button
                  type="submit"
                  className="button button-fill button-large disabled:opacity-50"
                  disabled={isSubmitting || !isValid}
                >
                  상품 추가
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Page>
  );
};

export default React.memo(AddItemInfoPage);
